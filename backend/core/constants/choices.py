from django.db import models

class RoleChoices(models.TextChoices):
    ADMIN = 'admin', 'Admin',
    MANAGER = 'manager', 'Manager'

class CourseChoices(models.TextChoices):
    FS = 'FS'
    QACX = 'QACX'
    JSCX = 'JSCX'
    JCX = 'JCX'
    FE = 'FE'
    PCX = 'PCX'

class CourseFormatChoices(models.TextChoices):
    STATIC = 'static'
    ONLINE = 'online'

class CourseTypeChoices(models.TextChoices):
    PRO = 'pro'
    MINIMAL = 'minimal'
    PREMIUM = 'premium'
    INCUBATOR = 'incubator'
    VIP = 'vip'

class StatusChoices(models.TextChoices):
    NEW = 'new', 'New'
    IN_WORK = 'in_work', 'In work'
    AGREE = 'agree', 'Agree'
    DISAGREE = 'disagree', 'Disagree'
    DUBBING = 'dubbing', 'Dubbing'
