import { NextRequest, NextResponse } from 'next/server';

const BILLING_SERVICE_URL = process.env.BILLING_SERVICE_URL || 'http://localhost:8084';

export async function GET(req: NextRequest) {
    try {
        const response = await fetch(`${BILLING_SERVICE_URL}/bills`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.get('authorization') || '',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to fetch bills' }));
            return NextResponse.json(error, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Billing service error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bills', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const response = await fetch(`${BILLING_SERVICE_URL}/bills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.get('authorization') || '',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to create bill' }));
            return NextResponse.json(error, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Billing service error:', error);
        return NextResponse.json(
            { error: 'Failed to create bill', message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 