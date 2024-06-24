from django.http import HttpRequest
from django.shortcuts import render
from django.utils.html import escape
import re
from django.core.exceptions import ValidationError

def validate_alphanumeric(value):
    if not re.match("^[a-zA-Z0-9_]*$", value):
        raise ValidationError('The field must contain only alphanumeric characters.')

def escape_html_in_data(data):
    if isinstance(data, dict):
        return {key: escape_html_in_data(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [escape_html_in_data(item) for item in data]
    elif isinstance(data, str):
        return escape(data)
    else:
        return data

def spa_render(request: HttpRequest, path, context=None):
    if request.headers.get('X-Source') == "SPA":
        return render(request, path, context=context)
    return render(request, 'index.html')
