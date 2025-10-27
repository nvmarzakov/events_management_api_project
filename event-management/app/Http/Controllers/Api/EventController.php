<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    /**
     * 🟢 List all events
     */
    public function index(): JsonResponse
    {
        $events = Event::latest()->get();
        return response()->json($events, 200);
    }

    /**
     * 🟢 Store a new event
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time'  => 'required|date',
            'end_time'    => 'required|date|after:start_time',
        ]);

        // Ако още нямаш auth — временно user_id = 1
        $validated['user_id'] = 1;

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Event created successfully.',
            'event' => $event
        ], 201);
    }

    /**
     * 🟢 Show single event
     */
    public function show(Event $event): JsonResponse
    {
        return response()->json($event, 200);
    }

    /**
     * 🟢 Update existing event
     */
    public function update(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'start_time'  => 'sometimes|date',
            'end_time'    => 'sometimes|date|after:start_time',
        ]);

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully.',
            'event' => $event
        ], 200);
    }

    /**
     * 🟢 Delete event
     */
    public function destroy(Event $event): JsonResponse
    {
        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully.'
        ], 200);
    }
}
