import connectMongoDB from '@/libs/mongodb'
import Topic from '@/models/topic'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { newTitle: title, newDescription: description } =
      await request.json()
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      )
    }
    await connectMongoDB()
    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    )
    if (!updatedTopic)
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 })
    return NextResponse.json(
      { message: 'Topic updated', topic: updatedTopic },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in PUT /api/topics/[id]', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectMongoDB()
    const topic = await Topic.findById(id)
    if (!topic)
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 })
    return NextResponse.json({ topic }, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/topics/[id]', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 선택: 405 해결(쿼리로 DELETE 치던 것 정리) — RESTfully /api/topics/:id 로 지워.
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectMongoDB()
    const deleted = await Topic.findByIdAndDelete(id)
    if (!deleted)
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 })
    return NextResponse.json({ message: 'Topic deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/topics/[id]', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
