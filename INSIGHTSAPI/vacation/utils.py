"""Utility functions for the vacation app."""

import holidays
from datetime import timedelta


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

def get_working_days(start_date, end_date, sat_is_working=True):
    """Get the number of working days between two dates."""
    working_days = 0
    for i in range((end_date - start_date).days + 1):
        if is_working_day(start_date + timedelta(days=i), sat_is_working):
            working_days += 1
    return working_days