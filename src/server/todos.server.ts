import { eq } from "drizzle-orm";
import { getDb } from "@/libs/db";
import {
    insertTodoSchema,
    type Todo,
    todos,
    updateTodoSchema,
} from "@/libs/db/todo.schema";

export async function getAllTodos(): Promise<Todo[]> {
    const db = await getDb();
    return await db.select().from(todos).orderBy(todos.createdAt);
}

export async function getTodoById(id: number): Promise<Todo | null> {
    const db = await getDb();
    const result = await db
        .select()
        .from(todos)
        .where(eq(todos.id, id))
        .limit(1);
    return result[0] || null;
}

export async function createTodo(data: unknown): Promise<Todo> {
    const validatedData = insertTodoSchema.parse(data);

    const db = await getDb();
    const result = await db
        .insert(todos)
        .values({
            ...validatedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        .returning();

    return result[0];
}

export async function updateTodo(
    id: number,
    data: unknown,
): Promise<Todo | null> {
    const validatedData = updateTodoSchema.parse(data);

    const db = await getDb();
    const result = await db
        .update(todos)
        .set({
            ...validatedData,
            updatedAt: new Date().toISOString(),
        })
        .where(eq(todos.id, id))
        .returning();

    return result[0] || null;
}

export async function deleteTodo(id: number): Promise<boolean> {
    const db = await getDb();

    // Check if todo exists first
    const existingTodo = await getTodoById(id);
    if (!existingTodo) {
        return false;
    }

    // Delete the todo
    await db.delete(todos).where(eq(todos.id, id));
    return true;
}
