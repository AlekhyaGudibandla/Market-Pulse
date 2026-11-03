import re
from datetime import datetime
from typing import Optional, Tuple


class TemporalExpressionParser:
    """
    Parses and standardizes temporal references found in news articles,
    press releases, and patent filings into structured datetimes.
    """
    @staticmethod
    def parse_event_date(text: str, fallback_date: Optional[datetime] = None) -> datetime:
        if not text:
            return fallback_date or datetime.utcnow()

        # Try ISO format
        for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%dT%H:%M:%S", "%Y/%m/%d"):
            try:
                return datetime.strptime(text.strip(), fmt)
            except ValueError:
                pass

        # Match Year-Month-Day or Month Day Year
        m = re.search(r"(\b20[2-3]\d\b)", text)
        if m:
            year = int(m.group(1))
            return datetime(year=year, month=1, day=1)

        return fallback_date or datetime.utcnow()

    @staticmethod
    def extract_validity_interval(text: str) -> Tuple[datetime, Optional[datetime]]:
        """
        Extracts 'since <date>' or '<start> to <end>' from text if present.
        """
        now = datetime.utcnow()
        # Check for ending / termination indicators
        terminated_patterns = [
            r"terminated\s+(?:on|in)?\s*([A-Za-z]+\s+\d{4}|\d{4})",
            r"ended\s+(?:on|in)?\s*([A-Za-z]+\s+\d{4}|\d{4})",
            r"dissolved\s+(?:on|in)?\s*([A-Za-z]+\s+\d{4}|\d{4})"
        ]
        for pat in terminated_patterns:
            m = re.search(pat, text, re.IGNORECASE)
            if m:
                # Valid until now
                return now, now

        return now, None


temporal_parser = TemporalExpressionParser()
