from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class MainPagePagination(PageNumberPagination):
    page_size = 25

    def get_paginated_response(self, data):
        return Response({
            'total_items': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'prev': bool(self.get_previous_link()),
            'next': bool(self.get_next_link()),
            'data': data,
        })

