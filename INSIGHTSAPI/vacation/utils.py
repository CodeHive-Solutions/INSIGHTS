"""Utility functions for the vacation app."""

import holidays
from datetime import datetime, timedelta
from distutils.util import strtobool


def is_working_day(date, sat_is_working=True):
    """Check if a date is a working day."""
    if isinstance(sat_is_working, str):
        sat_is_working = bool(strtobool(sat_is_working))
    if isinstance(date, str):
        date = datetime.strptime(date, "%Y-%m-%d")
    co_holidays = holidays.CO(years=date.year)
    if date in co_holidays:
        return False
    if date.weekday() == 5:
        return sat_is_working
    if date.weekday() == 6:
        return False
    return True


def get_working_days(start_date, end_date, sat_is_working=True):
    """Get the number of working days between two dates."""
    working_days = 0
    if isinstance(sat_is_working, str):
        sat_is_working = bool(strtobool(sat_is_working))
    if isinstance(start_date, str):
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
    if isinstance(end_date, str):
        end_date = datetime.strptime(end_date, "%Y-%m-%d")
    for i in range((end_date - start_date).days + 1):
        if is_working_day(start_date + timedelta(days=i), sat_is_working):
            working_days += 1
    return working_days


def get_return_date(end_date, sat_is_working=True) -> datetime:
    """Get the return date of a vacation request."""
    if isinstance(sat_is_working, str):
        sat_is_working = bool(strtobool(sat_is_working))
    if isinstance(end_date, str):
        end_date = datetime.strptime(end_date, "%Y-%m-%d")
    return_date = end_date + timedelta(days=1)
    while not is_working_day(return_date, sat_is_working):
        return_date += timedelta(days=1)
    return return_date
