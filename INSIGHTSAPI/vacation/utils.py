"""Utility functions for the vacation app."""

import holidays


def is_working_day(date, sat_is_working=True):
    """Check if a date is a working day."""
    us_holidays = holidays.CO(years=date.year)
    if date.weekday() == 5:
        return sat_is_working
    elif date.weekday() == 6:
        return False
    elif date in us_holidays:
        return False
    return True