from django.shortcuts import render, redirect
from .models import *
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import datetime


# Create your views here.
@csrf_exempt
def general(request):
    try:
        obj = json.loads(request.body.decode('utf-8'))
        print(obj)
    except:
        pass
    childtopics = ChildTopic.objects.filter(
        lvl_id=0,
    )

    context = {}
    context["topics"] = []
    for i in childtopics:
        context["topics"].append({"name": i.external_id.name, "id": str(i.external_id.id), "lvl": str(i.lvl_id + 1)})
    return render(request, "elevan_class/gen_info.html", context)


def add_date(request):
    countries = Country.objects.all()
    periods = HistoryPeriodDate.objects.all()
    context = {"countries": [{"name": f"{i.id}:{i.name}"} for i in countries], "periods": [{"name": f"{i.id}:{i.name}"} for i in periods]}
    return render(request, "elevan_class/add_date.html", context)


def replaced(name):
    n = ""
    signs = '''!()[] {};:'"\,<>./?@#$%^&*_~+-='''
    for i in name:
        if i not in signs:
            n += i
    return n


def get_topics(request, parent):
    try:
        if parent != 0:
            topic = Topic.objects.get(
                id=parent,
            )
            childtopics = ChildTopic.objects.filter(
                id_topic=topic
            )
        else:
            childtopics = ChildTopic.objects.filter(
                lvl_id=0,
            )

        context = {}
        context["topics"] = []
        for i in childtopics:
            context["topics"].append(
                    {"name": i.external_id.name, "id": str(i.external_id.id), "lvl": str(i.lvl_id + 1), "importance": i.importance, "redirect": i.redirect, "photo": i.external_id.photo})
    except Exception as ex:
        return HttpResponse(ex)
    return HttpResponse(json.dumps(context))


def show_info(request, topic):
    t = Topic.objects.get(
        id=topic,
    )
    childtopics = ChildTopic.objects.filter(
        id_topic=topic
    )

    return render(request, f"elevan_class/{t.console_name}.html")


def get_topic_by_name(request):
    context = {}
    context["topics"] = []
    topic_name = request.GET.get("topic", "")
    post = f"select * from general_topic where explore_name like '{topic_name}%'"

    topic = Topic.objects.raw(post)

    for i in topic:
        print(i)
        childtopic = ChildTopic.objects.get(
            external_id=i
        )

        context["topics"].append({"name": i.name, "id": str(i.id), "lvl": str(childtopic.lvl_id + 1), "importance": childtopic.importance, "redirect": childtopic.redirect, "photo": i.photo})

    return HttpResponse(json.dumps(context))


def name_date(date):

    d = datetime.date(*map(int, date))
    return d.strftime("%Y - (%d %B)")


def get_dates(request):
    context = {}
    context["dates"] = []
    dates = HistoryEventDate.objects.raw("select * from general_HistoryEventDate order by date asc;")
    for i in dates:
        if not i.without_md:
            date = str(i.date)[:4]
        else:
            date = name_date(str(i.date).split("-"))
        if i.period_id:
            context["dates"].append({"name": i.name, "date": date, "period": i.period_id.name})
        else:
            context["dates"].append(
                {"name": i.name, "date": date, "period": ""})
    return HttpResponse(json.dumps(context))


def post_date(request):
    if request.method == "POST":
        date_name = request.POST.get('date_name')
        without_md = request.POST.get('without_md')
        date = request.POST.get('date')
        country = request.POST.get('country')
        period = int(request.POST.get('period').split(":")[0])

        if not without_md:
            without_md = False
            date = datetime.date(int(date.split("-")[0]), 1, 1)
        else:
            without_md = True
        if period:
            d = HistoryEventDate.objects.create(
                name=date_name,
                without_md=without_md,
                date=date,
                country=Country.objects.get(id=int(country.split(":")[0])),
                period=HistoryPeriodDate.objects.get(id=period)
            )
        else:
            d = HistoryEventDate.objects.create(
                name=date_name,
                without_md=without_md,
                date=date,
                country=Country.objects.get(id=int(country.split(":")[0])),
            )
    return redirect('/new_date')


def get_definitions(request, topic):
    context = {"defs": []}
    t = Definition.objects.filter(topic=topic)
    for i in t:
        context["defs"].append({"name": i.name, "text": i.text, "formuls": []})
        f = Formula.objects.filter(defin=i)
        for b in f:
            context["defs"][-1]["formuls"].append({"frm": b.formul})
    return HttpResponse(json.dumps(context))


def get_form_info(request, form):
    f = AllForms.objects.get(id=form)
    datalists = [[]]
    if f.typee.id == 1:
        datalists[0] = [f.topic_id.name]
    elif f.typee.id == 2:
        datalists = [[], []]
        topics = ChildTopic.objects.raw("SELECT * FROM general_childtopic where redirect = '0' order by lvl_id desc;")
        for i in topics:
            name = []
            if i.lvl_id > 0:
                noww = i.id_topic
                for b in range(i.lvl_id):
                    if not noww:
                        break
                    name.append(noww.name)
                    noww = ChildTopic.objects.get(external_id=noww).id_topic
            name.reverse()
            name.append(i.external_id.name)
            datalists[0].append(":".join(name))
        datalists[1].append(1)
        datalists[1].append(2)
    content = {"answer": {"fields": f.typee.fields, "names": f.typee.names, "name": form, "datalists": datalists}}
    return HttpResponse(json.dumps(content))


def tests_for_topic(request, topic):
    return render(request, "elevan_class/testing.html")


def get_form(request, form):
    return render(request, "elevan_class/adds.html")


def post_info(request, form):
    f = AllForms.objects.get(id=form)
    if f.typee.id == 1:
        if request.method == "POST":
            d = Definition.objects.create(
                name=request.POST.get('name0'),
                text=request.POST.get('big_text1'),
                topic=Topic.objects.get(name=request.POST.get("country2"))
            )
    elif f.typee.id == 2:
        if request.method == "POST":
            idd = request.POST.get('country1').split(":")
            print(idd)
            lvl_id = 0
            importance = request.POST.get('country2')
            topic_names = Topic.objects.filter(
                name=idd[-1],
            )
            real_parent = 0
            for i in topic_names:

                try:
                    par = ChildTopic.objects.get(
                        external_id=i,
                        lvl_id=len(idd) - 1,

                    )
                    lvl_id = len(idd)
                    real_parent = i
                    print(real_parent)
                    break
                except Exception as ex:
                    pass

            name = request.POST.get('name0')

            topic = Topic.objects.create(
                name=name,
                explore_name=name.lower(),
                console_name=replaced(name).lower(),
            )
            topic.console_name = topic.console_name + str(topic.id)
            topic.photo = 'imgs/' + topic.console_name + '.png'
            topic.save()
            red = request.POST.get('without_md3')
            if red == 'on':
                red = "information/" + str(topic.id)
                with open(f"./static/jsss/{topic.console_name}.js", "w", encoding="utf-8") as f:
                    text = """import * as mainObj from './main_src.js'
            import * as needs from './all_need_funcs.js'



            // Пренастройки
            needs.start_settings(canvas, document.getElementsByClassName("container")[0])


            // Линейная фенкция
            function kx_b(obCanvas, params, x1, color, linewidth, cell, center, now1, now2) {
                let xglob = (x1 - center[0] - now1) / cell
                let yglob = params[0] * (xglob) + params[1]
                needs.draw_point(obCanvas, x1, -yglob * cell + center[1] + now2, color, linewidth / 2)
            }


            mainObj.main(kx_b, [1, 0])


            needs.set_slider("kslid", "k", mainObj, 0)"""
                    f.write(text)
                    f.close()
                with open(f"./templates/elevan_class/{topic.console_name}.html", "w", encoding="utf-8") as f:
                    text = """{% extends "elevan_class/main_graf.html" %}


            {% load static %}
            {% block content %}
            <div class="about">
                <div class="content">


                </div>
            </div>
            <div class="all">
                <h1>График</h1>
                <div class="center">
                    <div class="container">
                        <canvas id="canvas"></canvas>
                    </div>
                    <div class="changing">
                        <p id="a" class="text">A=</p>
                        <input type="range" min="-10" max="10" step="0.05" id="aslid" value="1">
                    </div>
                </div>
                <script src="{% static 'jsss/""" + topic.console_name + """.js' %}" type="module"></script>
            </div>
            {% endblock %}"""
                    f.write(text)
                    f.close()
            else:
                red = '0'

            if idd[0]:
                childtopic = ChildTopic.objects.create(
                    external_id=topic,
                    lvl_id=lvl_id,
                    id_topic=real_parent,
                    importance=int(importance),
                    redirect=red
                )
            else:
                childtopic = ChildTopic.objects.create(
                    external_id=topic,
                    lvl_id=lvl_id,
                    importance=int(importance),
                    redirect=red
                )
        return redirect("/")
    return redirect("/information/" + str(f.topic_id.id))
