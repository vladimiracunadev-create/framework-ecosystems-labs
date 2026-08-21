using Microsoft.EntityFrameworkCore;

var constructor = WebApplication.CreateBuilder(args);

constructor.Services.AddDbContext<Contexto>(opciones => opciones.UseSqlite("Data Source=datos.db"));

var app = constructor.Build();

using (var ambito = app.Services.CreateScope())
{
    var inicial = ambito.ServiceProvider.GetRequiredService<Contexto>();
    await inicial.Database.EnsureDeletedAsync();
    await inicial.Database.EnsureCreatedAsync();
    await Sembrar(inicial);
}

static async Task Sembrar(Contexto contexto)
{
    await contexto.Cuentas.ExecuteDeleteAsync();
    contexto.Cuentas.AddRange(
        new Cuenta { Id = 1, Saldo = 100 },
        new Cuenta { Id = 2, Saldo = 100 });
    await contexto.SaveChangesAsync();
}

static async Task<IResult> Estado(Contexto contexto)
{
    var saldos = await contexto.Cuentas.OrderBy(c => c.Id).Select(c => c.Saldo).ToListAsync();
    return Results.Json(new { cuentas = saldos, total = saldos.Sum() });
}

app.MapGet("/reiniciar", async (Contexto contexto) =>
{
    await Sembrar(contexto);
    return await Estado(contexto);
});

app.MapGet("/cuentas", async (Contexto contexto) => await Estado(contexto));

// CON transacción explícita.
//
// EF Core ya envuelve cada `SaveChangesAsync` en su propia transacción — esa
// parte es automática. Lo que NO es automático es agrupar VARIOS guardados, y
// eso es exactamente lo que hace falta aquí: entre el cobro y el abono hay una
// lectura que puede fallar.
app.MapPost("/transferir", async (Contexto contexto, Movimiento movimiento) =>
{
    await using var transaccion = await contexto.Database.BeginTransactionAsync();
    var fallo = await Mover(contexto, movimiento);
    if (fallo is not null)
    {
        // Deshacer explícitamente. Salir del `using` sin confirmar también lo
        // haría, pero decirlo en voz alta es más honesto que confiar en ello.
        await transaccion.RollbackAsync();
        return Results.Json(new { code = fallo.Codigo }, statusCode: fallo.Estado);
    }
    await transaccion.CommitAsync();
    return Results.Json(new { ok = true });
});

/** SIN transacción: mismo código, mismo error, y diez unidades evaporadas. */
app.MapPost("/transferir-sin-transaccion", async (Contexto contexto, Movimiento movimiento) =>
{
    var fallo = await Mover(contexto, movimiento);
    return fallo is not null
        ? Results.Json(new { code = fallo.Codigo }, statusCode: fallo.Estado)
        : Results.Json(new { ok = true });
});

// Los dos fallos posibles, y son distintos: `SALDO_INSUFICIENTE` se detecta
// ANTES de escribir nada, y `NO_EXISTE` DESPUÉS de haber cobrado. Solo el
// segundo necesita la transacción.
static async Task<Fallo?> Mover(Contexto contexto, Movimiento movimiento)
{
    var origen = await contexto.Cuentas.FindAsync(movimiento.De);
    if (origen is null) return new Fallo(404, "NO_EXISTE");
    if (origen.Saldo < movimiento.Monto) return new Fallo(409, "SALDO_INSUFICIENTE");

    // El cobro va PRIMERO, a propósito: es lo que hace visible la diferencia.
    origen.Saldo -= movimiento.Monto;
    await contexto.SaveChangesAsync();

    var destino = await contexto.Cuentas.FindAsync(movimiento.A);
    if (destino is null) return new Fallo(404, "NO_EXISTE");

    destino.Saldo += movimiento.Monto;
    await contexto.SaveChangesAsync();
    return null;
}

app.Run();

record Movimiento(int De, int A, int Monto);

record Fallo(int Estado, string Codigo);

class Cuenta
{
    public int Id { get; set; }
    public int Saldo { get; set; }
}

class Contexto(DbContextOptions<Contexto> opciones) : DbContext(opciones)
{
    public DbSet<Cuenta> Cuentas => Set<Cuenta>();

    protected override void OnModelCreating(ModelBuilder constructor)
    {
        // Sin esto EF Core asigna el identificador solo, y la semilla no podría
        // fijar los números 1 y 2 que el contrato espera.
        constructor.Entity<Cuenta>().Property(c => c.Id).ValueGeneratedNever();
    }
}
