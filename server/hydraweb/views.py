from django.shortcuts import render
from rest_framework.response import Response

# Create your views here.
from rest_framework import viewsets, status
from rest_framework import views
import os 
import pymongo
import json


import pprint

class LayerAPIView(views.APIView):

    def get(self,request):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        all_dir = os.listdir(f"{dir_path}/data")
        result = []
        for dir in all_dir:
            is_time_series = False
            json_list = os.listdir(f"{dir_path}/data/{dir}")
            res_json = []
            for js in json_list:
                f = open(f'{dir_path}/data/{dir}/{js}',"r",encoding="utf-8")
                if js.startswith("time_series_"):
                    is_time_series = True
                else :
                    is_time_series = False
                json_data = json.load(f)
                res_json.append({"name":f"{js}","data":json_data,"time_serie":is_time_series})
            result.append({"name":f"{dir}","file":res_json})


        return Response({"status":"created","data":result}, status=status.HTTP_200_OK)   

class LayerListAPIView(views.APIView):

    def get(self,request):
        client = pymongo.MongoClient('mongodb://localhost:27017')
        db = client['hydraweb']
        collection = db.get_collection("maps")
        resultarr = []
        res_json = []
        result = collection.find()
        
        for dt in result:
            i = 0
            for feat in dt['features']:
                print(feat)
                
                break
                #new_json = {
                #    "type": "FeatureCollection",
                #    "features": [feat]
                #}
                #res_json.append({"name": i, "data": new_json,"time_serie":False})
                #i = i + 1
            #resultarr.append({"name": 'test', "file":res_json})
            #break 

        return Response({"status":"created","data":resultarr}, status=status.HTTP_200_OK)   
        pass
