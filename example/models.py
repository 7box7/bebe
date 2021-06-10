from django.db import models


# Create your models here.
class Topic(models.Model):
    name = models.CharField(
        verbose_name="Название темы",
        max_length=100
    )

    explore_name = models.CharField(
        verbose_name="Название темы для поиска",
        max_length=100,
        default="8"
    )
    console_name = models.CharField(
        verbose_name="Название темы для файлов",
        max_length=100,
        default="9"
    )

    photo = models.CharField(
        verbose_name="Путь к картинке",
        max_length=100,
        default="imgs/1.png"
    )

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "Тема"
        verbose_name_plural = "Темы"


class ChildTopic(models.Model):
    external_id = models.ForeignKey(
        to="example.Topic",
        verbose_name="ID темы",
        on_delete=models.CASCADE,
        related_name='topic_content_type'
    )

    lvl_id = models.PositiveIntegerField(
        verbose_name="Уровень вложенности",
    )

    id_topic = models.ForeignKey(
        to="example.Topic",
        verbose_name="ID Родительской темы",
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    importance = models.PositiveIntegerField(
        verbose_name="Значимость темы",
        default=1
    )

    redirect = models.CharField(
        verbose_name="Ссылка на страницу",
        max_length=100,
        default="0"
    )

    def __str__(self):
        return f"#{self.external_id}:{self.id_topic}"

    class Meta:
        verbose_name = "Дочерние темы"
        verbose_name_plural = "Дочерние темы"


class Country(models.Model):
    name = models.CharField(
        verbose_name="Название",
        max_length=200
    )

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "Страна"
        verbose_name_plural = "Страны"


class Way(models.Model):
    name = models.CharField(
        verbose_name="Название",
        max_length=200
    )

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "Направление"
        verbose_name_plural = "Направления"


class HistoryPeriodDate(models.Model):
    name = models.CharField(
        verbose_name="Название",
        max_length=100
    )

    start_date = models.DateField(
        verbose_name="Дата начала"
    )

    end_date = models.DateField(
        verbose_name="Дата конца"
    )

    def __str__(self):
        return f"{self.name}:{self.start_date}:{self.end_date}"

    class Meta:
        verbose_name = "Период"
        verbose_name_plural = "Периоды"


class HistoryEventDate(models.Model):
    name = models.CharField(
        verbose_name="Название",
        max_length=100
    )

    without_md = models.BooleanField(
        verbose_name="Есть ли месяц день",
        default=True
    )

    date = models.DateField(
        verbose_name="Дата"
    )

    country = models.ForeignKey(
        to="example.Country",
        verbose_name="Страна",
        on_delete=models.PROTECT,
    )

    period_id = models.ForeignKey(
        to="example.HistoryPeriodDate",
        verbose_name="ID периода",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.country}:{self.date}"

    class Meta:
        verbose_name = "Дата"
        verbose_name_plural = "Даты"


class HistoryHumanDate(models.Model):
    name = models.CharField(
        verbose_name="ФИО",
        max_length=100
    )

    date = models.CharField(
        verbose_name="Годы жизни",
        max_length=100
    )

    country = models.ForeignKey(
        to="example.Country",
        verbose_name="Страна",
        on_delete=models.PROTECT,
    )

    who = models.ForeignKey(
        to="example.Way",
        verbose_name="Направление",
        on_delete=models.PROTECT,
    )

    def __str__(self):
        return f"{self.name}:{self.date}"

    class Meta:
        verbose_name = "Знаменитость"
        verbose_name_plural = "Знаменитости"


class HistoryKingDate(models.Model):
    name = models.CharField(
        verbose_name="ФИО",
        max_length=100
    )

    date = models.CharField(
        verbose_name="Годы жизни",
        max_length=100
    )

    country = models.ForeignKey(
        to="example.Country",
        verbose_name="Страна",
        on_delete=models.PROTECT,
    )

    def __str__(self):
        return f"{self.name}:{self.date}"

    class Meta:
        verbose_name = "Правитель"
        verbose_name_plural = "Правители"


class Definition(models.Model):

    name = models.CharField(
        verbose_name="Понятие",
        max_length=100,
    )

    text = models.TextField(
        verbose_name="Определение",
    )

    topic = models.ForeignKey(
        to='example.Topic',
        verbose_name="Тема",
        on_delete=models.PROTECT,
    )

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "Понятие"
        verbose_name_plural = "Понятия"


class Formula(models.Model):

    formul = models.CharField(
        verbose_name="Формула",
        max_length=200
    )

    defin = models.ForeignKey(
        to="example.Definition",
        verbose_name="Понятие",
        on_delete=models.PROTECT,
    )

    def __str__(self):
        return f"{self.formul}"

    class Meta:
        verbose_name = "Формула"
        verbose_name_plural = "Формулы"


class AllForms(models.Model):

    name = models.CharField(
        verbose_name="Название Формы",
        max_length=100,
        unique=True,
    )

    typee = models.ForeignKey(
        verbose_name="Тип формы",
        to="example.FormType",
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    topic_id = models.ForeignKey(
        to="example.Topic",
        verbose_name="Тема формы",
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "Форма"
        verbose_name_plural = "Формы"


class FormType(models.Model):
    fields = models.CharField(
        verbose_name="Порядок полей",
        max_length=50,
    )

    names = models.CharField(
        verbose_name="Название полей",
        max_length=500
    )

    class Meta:
        verbose_name = "Тип формы"
        verbose_name_plural = "Типы форм"
