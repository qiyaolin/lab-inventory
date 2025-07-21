from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import PurchaseRequest
from .serializers import PurchaseRequestSerializer

# Create your views here.

class PurchaseRequestViewSet(viewsets.ModelViewSet):
    """
    API endpoint for handling purchase requests.
    - Researchers can create and view their own requests.
    - Lab Managers/Admins can view all requests and approve/reject them.
    """
    queryset = PurchaseRequest.objects.all().order_by('-date_requested')
    serializer_class = PurchaseRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['Admin', 'Manager']:
            # Admins/Managers can see all requests
            return PurchaseRequest.objects.all().order_by('-date_requested')
        # Researchers can only see their own requests
        return PurchaseRequest.objects.filter(requester=user).order_by('-date_requested')

    def perform_create(self, serializer):
        # Automatically set the requester to the current logged-in user
        serializer.save(requester=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser]) # Or a custom Manager permission
    def approve(self, request, pk=None):
        """Custom action to approve a purchase request."""
        purchase_request = self.get_object()
        if purchase_request.status != 'Pending':
            return Response({'error': 'Request must be in Pending state to be approved.'}, status=status.HTTP_400_BAD_REQUEST)
        
        purchase_request.status = 'Approved'
        purchase_request.date_approved = timezone.now()
        purchase_request.save()
        return Response(self.get_serializer(purchase_request).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser]) # Or a custom Manager permission
    def reject(self, request, pk=None):
        """Custom action to reject a purchase request."""
        purchase_request = self.get_object()
        if purchase_request.status != 'Pending':
            return Response({'error': 'Request must be in Pending state to be rejected.'}, status=status.HTTP_400_BAD_REQUEST)

        purchase_request.status = 'Rejected'
        purchase_request.save()
        return Response(self.get_serializer(purchase_request).data)