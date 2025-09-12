import { type NextRequest, NextResponse } from "next/server";
import { deleteTodo, getTodoById, updateTodo } from "@/server/todos.server";

type Params = {
    params: Promise<{ id: string }>;
};

// GET /api/todos/[id] - Get specific todo
export async function GET(_: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const todoId = parseInt(id, 10);

        if (Number.isNaN(todoId)) {
            return NextResponse.json(
                { success: false, error: "Invalid todo ID" },
                { status: 400 },
            );
        }

        const todo = await getTodoById(todoId);

        if (!todo) {
            return NextResponse.json(
                { success: false, error: "Todo not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: todo,
        });
    } catch (error) {
        console.error("Error fetching todo:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch todo" },
            { status: 500 },
        );
    }
}

// PUT /api/todos/[id] - Update specific todo
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const todoId = parseInt(id, 10);

        if (Number.isNaN(todoId)) {
            return NextResponse.json(
                { success: false, error: "Invalid todo ID" },
                { status: 400 },
            );
        }

        const body = await request.json();
        const todo = await updateTodo(todoId, body);

        if (!todo) {
            return NextResponse.json(
                { success: false, error: "Todo not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: todo,
            message: "Todo updated successfully",
        });
    } catch (error: any) {
        console.error("Error updating todo:", error);

        if (error.name === "ZodError") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Validation error",
                    details: error.errors,
                },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to update todo" },
            { status: 500 },
        );
    }
}

// DELETE /api/todos/[id] - Delete specific todo
export async function DELETE(_: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const todoId = parseInt(id, 10);

        if (Number.isNaN(todoId)) {
            return NextResponse.json(
                { success: false, error: "Invalid todo ID" },
                { status: 400 },
            );
        }

        const deleted = await deleteTodo(todoId);

        if (!deleted) {
            return NextResponse.json(
                { success: false, error: "Todo not found" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Todo deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting todo:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete todo" },
            { status: 500 },
        );
    }
}
