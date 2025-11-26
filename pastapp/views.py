from django.shortcuts import render

def index(request):
    return render(request, 'pastapp/index.html', {})

def past(request):
    return render(request, 'pastapp/pasto.html', {})

def index_past(request):
    return render(request, 'pastapp/past.html', {})

def pastest(request):
    return render(request, 'pastapp/pastest.html', {})
    
def juan(request):
    return render(request, 'pastapp/pastojuan.html', {})
    
def azar(request):
    return render(request, 'pastapp/pastoazar.html', {})