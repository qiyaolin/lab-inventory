from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PurchaseRequestViewSet

router = DefaultRouter()
router.register(r'requests', PurchaseRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('requests/<int:pk>/approve/', PurchaseRequestViewSet.as_view({'post': 'approve'}), name='request-approve'),
    path('requests/<int:pk>/reject/', PurchaseRequestViewSet.as_view({'post': 'reject'}), name='request-reject'),
] 