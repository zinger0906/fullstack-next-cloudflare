import { type NextRequest, NextResponse } from "next/server";
import { createTodo, getAllTodos } from "@/server/todos.server";

export async function GET() {
    try {
        const allTodos = await getAllTodos();
        return NextResponse.json({
            success: true,
            data: allTodos,
        });
    } catch (error) {
        console.error("Error fetching todos:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch todos" },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const todo = await createTodo(body);

        return NextResponse.json(
            {
                success: true,
                data: todo,
                message: "Todo created successfully",
            },
            { status: 201 },
        );
    } catch (error: any) {
        console.error("Error creating todo:", error);

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
            { success: false, error: "Failed to create todo" },
            { status: 500 },
        );
    }
}
