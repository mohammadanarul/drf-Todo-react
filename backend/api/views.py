from rest_framework.decorators import api_view
from rest_framework.response import Response
# from uritemplate import partial
from .serializers import TaskSerializer
from .models import Task

@api_view(['GET'])
def api_overview(request):
    data = {
        'api-list':'api/list-api/',
        'task-create':'api/create-task/',
        'task-update':'api/update-task/pk/',
        'partially-task':'api/partially-task/pk/',
        'task-delete':'api/delete-task/pk/',
    }
    return Response(data)

@api_view(['GET'])
def task_list_api(request):
    task = Task.objects.all()
    serializer = TaskSerializer(task, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_task_api(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST'])
def update_task_api(request, pk):
    task = Task.objects.get(pk=pk)
    serializer = TaskSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['PATCH'])
def partially_task_api(request, pk):
    task = Task.objects.get(pk=pk)
    serializer = TaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"status": "success", "data": serializer.data})
    else:
        return Response({"status": "error", "data": serializer.errors})
    
@api_view(['DELETE'])
def delete_task_api(request, pk):
    task = Task.objects.get(pk=pk)
    task.delete()
    return Response({"status": "Succsesfully deleted your task."})
    