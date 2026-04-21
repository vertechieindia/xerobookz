"""Pure state machine for real-time attendance events."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import List, Optional, Tuple


class EventType(str, Enum):
    PUNCH_IN = "PUNCH_IN"
    PUNCH_OUT = "PUNCH_OUT"
    BREAK_IN = "BREAK_IN"
    BREAK_OUT = "BREAK_OUT"


class WorkState(str, Enum):
    OFF = "OFF"
    WORKING = "WORKING"
    ON_BREAK = "ON_BREAK"


def _parse_event(t: str) -> EventType:
    return EventType(t)


def session_events_after_last_punch_out(
    events_chronological: List[Tuple[EventType, object]],
) -> List[Tuple[EventType, object]]:
    """Partition: events after the last PUNCH_OUT (open session). events_chronological sorted by time asc."""
    last_po_idx = -1
    for i, (et, _) in enumerate(events_chronological):
        if et == EventType.PUNCH_OUT:
            last_po_idx = i
    return events_chronological[last_po_idx + 1 :]


def compute_state(session_events: List[EventType]) -> WorkState:
    """Apply session events in order; return current work state."""
    state = WorkState.OFF
    for et in session_events:
        if et == EventType.PUNCH_IN:
            if state != WorkState.OFF:
                raise ValueError("Invalid: PUNCH_IN when not OFF")
            state = WorkState.WORKING
        elif et == EventType.PUNCH_OUT:
            if state != WorkState.WORKING:
                raise ValueError("Invalid: PUNCH_OUT when not WORKING")
            state = WorkState.OFF
        elif et == EventType.BREAK_IN:
            if state != WorkState.WORKING:
                raise ValueError("Invalid: BREAK_IN when not WORKING")
            state = WorkState.ON_BREAK
        elif et == EventType.BREAK_OUT:
            if state != WorkState.ON_BREAK:
                raise ValueError("Invalid: BREAK_OUT when not ON_BREAK")
            state = WorkState.WORKING
    return state


def validate_next_event(session_events: List[EventType], next_event: EventType) -> None:
    """Raise ValueError if next_event is illegal given current session (open) events."""
    current = compute_state(session_events)
    if next_event == EventType.PUNCH_IN:
        if current != WorkState.OFF:
            raise ValueError("Cannot PUNCH_IN: already in an open session")
    elif next_event == EventType.PUNCH_OUT:
        if current != WorkState.WORKING:
            raise ValueError("Cannot PUNCH_OUT: must be WORKING (finish break first if on break)")
    elif next_event == EventType.BREAK_IN:
        if current != WorkState.WORKING:
            raise ValueError("Cannot BREAK_IN: must be WORKING")
    elif next_event == EventType.BREAK_OUT:
        if current != WorkState.ON_BREAK:
            raise ValueError("Cannot BREAK_OUT: must be ON_BREAK")


def build_session_event_types(
    events_chronological: List[Tuple[str, object]],
) -> List[EventType]:
    return [_parse_event(t) for t, _ in session_events_after_last_punch_out(
        [(_parse_event(t), ts) for t, ts in events_chronological]
    )]
