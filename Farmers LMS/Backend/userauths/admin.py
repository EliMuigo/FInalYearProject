from django.contrib import admin

# Register your models here.
from userauths.models import User,Profile

class ProfileAdmin(admin.ModelAdmin):
  list_display = ['user','full_name','date']



admin.site.register(User)

admin.site.register(Profile,ProfileAdmin)