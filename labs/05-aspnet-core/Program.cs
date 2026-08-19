using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
var tasks = new ConcurrentDictionary<string, TaskItem>();
var idempotency = new ConcurrentDictionary<string, TaskItem>();
var sequence = 0;

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/tasks", () => Results.Ok(new { items = tasks.Values }));
app.MapGet("/tasks/{taskId}", (string taskId) => tasks.TryGetValue(taskId, out var task)
    ? Results.Ok(task)
    : Results.NotFound(Problem("TASK_NOT_FOUND", "Task was not found")));
app.MapPost("/tasks", (HttpRequest request, CreateTask input) => {
    var key = request.Headers["Idempotency-Key"].ToString().Trim();
    if (string.IsNullOrEmpty(key)) return Results.BadRequest(Problem("IDEMPOTENCY_KEY_REQUIRED", "Idempotency-Key is required"));
    if (idempotency.TryGetValue(key, out var previous)) return Results.Ok(previous);
    var title = input.Title?.Trim() ?? "";
    if (title.Length is < 1 or > 120) return Results.UnprocessableEntity(Problem("VALIDATION_ERROR", "Title must contain 1 to 120 characters"));
    var task = new TaskItem($"task-{Interlocked.Increment(ref sequence)}", title, false, DateTimeOffset.UtcNow);
    tasks[task.Id] = task; idempotency[key] = task;
    return Results.Created($"/tasks/{task.Id}", task);
});

app.Run("http://127.0.0.1:3004");

static object Problem(string code, string message) => new { error = new { code, message } };
record CreateTask(string? Title);
record TaskItem(string Id, string Title, bool Completed, DateTimeOffset CreatedAt);
