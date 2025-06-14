import { NextRequest, NextResponse } from 'next/server';

const DOCTOR_SERVICE_URL = process.env.DOCTOR_SERVICE_URL || 'http://localhost:8086';

export async function GET(req: NextRequest) {
    try {
        const response = await fetch(`${DOCTOR_SERVICE_URL}/doctors`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const response = await fetch(`${DOCTOR_SERVICE_URL}/doctors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
    }
} 