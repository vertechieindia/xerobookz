"""Unit tests: attendance event state machine."""

import os
import sys

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app.services.state_machine import EventType, WorkState, compute_state, validate_next_event


def test_off_to_punch_in_to_break_to_punch_out():
    seq = [EventType.PUNCH_IN, EventType.BREAK_IN, EventType.BREAK_OUT, EventType.PUNCH_OUT]
    assert compute_state(seq) == WorkState.OFF


def test_cannot_punch_out_on_break():
    seq = [EventType.PUNCH_IN, EventType.BREAK_IN]
    with pytest.raises(ValueError):
        validate_next_event(seq, EventType.PUNCH_OUT)


def test_cannot_break_out_without_break_in():
    seq = [EventType.PUNCH_IN]
    with pytest.raises(ValueError):
        validate_next_event(seq, EventType.BREAK_OUT)


def test_multiple_breaks_allowed():
    seq = [
        EventType.PUNCH_IN,
        EventType.BREAK_IN,
        EventType.BREAK_OUT,
        EventType.BREAK_IN,
        EventType.BREAK_OUT,
    ]
    validate_next_event(seq, EventType.PUNCH_OUT)


def test_cannot_punch_in_twice():
    seq = [EventType.PUNCH_IN]
    with pytest.raises(ValueError):
        validate_next_event(seq, EventType.PUNCH_IN)
