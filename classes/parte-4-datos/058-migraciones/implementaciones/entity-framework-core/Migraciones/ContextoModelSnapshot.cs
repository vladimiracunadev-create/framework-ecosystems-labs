using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Labs.Migraciones;

/// <summary>
/// La instantánea del modelo. No se ejecuta nunca: es lo que `dotnet ef
/// migrations add` compara con las entidades para calcular la migración
/// SIGUIENTE.
///
/// De ahí que borrarla o editarla a mano rompa la generación de migraciones
/// futuras aunque las existentes sigan aplicándose sin problema.
/// </summary>
[DbContext(typeof(Contexto))]
public class ContextoModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder constructor)
    {
        constructor.Entity("Tarea", b =>
        {
            b.Property<int>("Id").ValueGeneratedOnAdd().HasColumnType("INTEGER");
            b.Property<string>("Titulo").IsRequired().HasColumnType("TEXT");
            b.Property<int>("Prioridad").HasColumnType("INTEGER").HasDefaultValue(0);
            b.HasKey("Id");
            b.ToTable("Tareas");
        });
    }
}
