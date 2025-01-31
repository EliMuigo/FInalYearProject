from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from userauths.models import Profile, User
from django.contrib.auth.password_validation import validate_password

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
  @classmethod
  def get_token(cls, user):
    token = super().get_token(user)

    token['full_name'] = user.full_name
    token['email'] = user.email
    token['username'] = user.username

    return token
class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True,required=True)


  class Meta:
    model = User
    fields = ['email','username','full_name','password','password2']
    extra_kwargs = {
      'password': {'write_only': True},
    }

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError({"password":"Password fields didn't match."})

    return attrs

  def create(self, validated_data):
    user = User.objects.create(
      email=validated_data['email'],
      username=validated_data['username'],
      full_name=validated_data['full_name']
    )

    email_username, full_name = validated_data['email'].split("@")
    user.username = email_username

    user.set_password(validated_data['password'])
    user.save()

    return user

  

class UserSerializer(serializers.ModelSerializer):

  class Meta:
    model = User
    fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):

  class Meta:
    model = Profile
    fields = '__all__'
