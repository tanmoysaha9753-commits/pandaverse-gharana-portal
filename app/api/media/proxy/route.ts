   // Media files are served via signed URLs from server components.
   // This placeholder route prevents Next.js from treating the directory as broken.

   export const dynamic = 'force-dynamic';

   import { NextResponse } from 'next/server';

   export async function GET() {
     return NextResponse.json({ error: 'Not found' }, { status: 404 });
   }
