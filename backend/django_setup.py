
#!1 - Settings.py
    #?-base.py:
        #from pathlib import Path
        # import os  # Do not delete this

        # # Your everywhere service name

        # SITE_NAME = ""
        # # Build paths inside the project like this: BASE_DIR / 'subdir'.
        # BASE_DIR = Path(__file__).resolve().parent.parent.parent


        # # SECURITY WARNING: keep the secret key used in production secret!
        # SECRET_KEY = os.getenv(
        #     "DJANGO_KEY",
        #     default=“”,
        # )


        # # Application definition
        # DEFAULT_APPS = [
        #     "django.contrib.admin",
        #     "django.contrib.auth",
        #     "django.contrib.contenttypes",
        #     "django.contrib.sessions",
        #     "django.contrib.messages",
        #     "django.contrib.staticfiles",
        # ]

        # THIRD_PARTY_APPS = []

        # CREATED_APPS = []


        # INSTALLED_APPS = DEFAULT_APPS + CREATED_APPS + THIRD_PARTY_APPS 

        # MIDDLEWARE = []

        # ROOT_URLCONF = 
        # TEMPLATES = 
        # WSGI_APPLICATION = 
        # AUTH_PASSWORD_VALIDATORS = 
        # # Internationalization
        # …
        # # Static files (CSS, JavaScript, Images)
        # …
        # if not os.path.exists("logs"):
        #     os.makedirs(os.path.join(BASE_DIR, "logs"))

    #------------------------------------------------------------------------------------------------------------------------
    #?development.py
        #from .base import *

        # # import socket  # only if you haven't already imported this

        # DEBUG = True

        # ALLOWED_HOSTS = [
        #     "localhost",
        #     "127.0.0.1",
        # ]

        # try:
        #     from .local import *
        # except Exception:
        #     pass

        # DATABASES = {
        #     "default": {
        #         "ENGINE": "django.db.backends.sqlite3",
        #         "NAME": BASE_DIR / "db.sqlite3",
        #     }
        # }


        # INSTALLED_APPS += [
        #     "debug_toolbar",
        #     #    'django_extensions'
        # ]

        # MIDDLEWARE += [
        #     "debug_toolbar.middleware.DebugToolbarMiddleware",
        # ]

        # """
        #     These commented config  will use \
        #         when you are running the project on Docker. 
        # """
        # # hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
        # # INTERNAL_IPS = [ip[:-1] + "1" for ip in ips] + ["127.0.0.1", "10.0.2.2"]

        # INTERNAL_IPS = ["127.0.0.1", "10.0.2.2"]
        
    #------------------------------------------------------------------------------------------------------------------------
    #?production.py
    # from .base import *

    # DEBUG = False

    # ALLOWED_HOSTS = [
    # #YOUR_PRODUCTION_HOSTS_ADDRESSESS
    # ]

    # DATABASES = {
    #     "default": {
    #         "ENGINE": "django.db.backends.postgresql_psycopg2",
    #         "NAME": os.getenv("DB_NAME", default="db"),
    #         "USER": os.getenv("DB_USER", default="root"),
    #         "PASSWORD": os.getenv("DB_PASS", default="root-password"),
    #         "HOST": "postgres",
    #         "PORT": "5432",
    #     }
    # }
    
#-----------------------------------------------------------------------------------------------------------------------------

#!When we have our three files, We must somehow manage them at the entry point of the settings module and I mean the __init__.py: your module initializer file:
    #?__init__.py:
    # from os import getenv
    # env = getenv("DJANGO_ENV", default="development")

    # if env == "production":
    #     print("You Are in the Production Mode.")
    #     from .porduction import *
    # elif env == "development":
    #     print("Warning! You Are in the Development Mode.\nDo Not use in any server.")
    #     from .development import *

#-----------------------------------------------------------------------------------------------------------------------------
#!Always Have a TODO :
    #-#https://github.com/mrShahsafi/Edu/blob/master/djnagoForFun/TODO.md

#-----------------------------------------------------------------------------------------------------------------------------

#!Django custom management commands:    
    #-https://github.com/mrShahsafi/Winance/tree/main/wallet/management/commands
    
#---------------------------------------------------------------------------------------------------------------------------------
#!Store your service messages in a separated file:
    #-https://github.com/mrShahsafi/Edu/blob/master/djnagoForFun/core/responses/api_messages.py
    
#---------------------------------------------------------------------------------------------------------------------------------------
#!Bypassing the meanings
    #Sometimes some action do not really need to done as it seems!
    # for example, you need to delete big amount of data from your database daily.
    # It will be a expensive transaction for your database
    # Use abstract model that contains is_deleted attribute with the False default value and try to inherite all your other models from this common model.
        #?qs = Model.objects.filter(is_deleted=Flase)

#---------------------------------------------------------------------------------------------------------------------------------------

