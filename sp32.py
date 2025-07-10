from machine import Pin, DAC, SDCard
import time
import network
import urequests
import uos
import ujson
import gc
import sys
import utime

"""-------------------------------------------------------------------"""
def init_sd_card():
    """Inicializa y monta la tarjeta SD."""
    try:
        sd = SDCard(slot=2, sck=Pin(18), miso=Pin(19),
                            mosi=Pin(23), cs=Pin(5), freq=1_000_000)
        vfs = uos.VfsFat(sd)
        uos.mount(vfs, '/sd')
        print("SD Card montada correctamente")
        return True
    except Exception as e:
        print("Error al montar SD Card:", e)
        return False

"""-----------------------------------------------------------------------"""

def obtener_wlan():
  return network.WLAN(network.STA_IF)

def activar_y_conectar(wlan, ssid, password):
  wlan.active(True)
  wlan.connect(ssid, password)
  while not wlan.isconnected():
    time.sleep(0.1)

def conectar_wifi(ssid, password):
  wlan = obtener_wlan()
  if not wlan.isconnected():
    print("Conectando a WiFi...")
    activar_y_conectar(wlan, ssid, password)
  print("Configuración de red:", wlan.ifconfig())

"""-----------------------------------------------------------------------"""
    
def play_wav_stream(filename, sample_rate=8000):
    """Reproduce un archivo WAV crudo por el DAC."""
    try:
        print("Iniciando reproducción...")  
        sample_delay = int(1_000_000 / sample_rate)
        buffer = bytearray(32)
        with open(filename, "rb") as f:
            last_time = utime.ticks_us()
            while True:
                bytes_read = f.readinto(buffer)
                if not bytes_read:
                    break
                for sample in buffer:
                    dac.write(sample)
                    while utime.ticks_diff(utime.ticks_us(), last_time) < sample_delay:
                        pass
                    last_time = utime.ticks_us()

        dac.write(0)  # silencio
    except Exception as e:
        print("Error en reproducción:", e)
        try:
            dac.write(128)
        except:
            pass
        raise  # para que los reintentos lo detecten
"-------------------------------------------------------------------------------------------"

def conexionApi(prompt, endpoint):
#     url = "https://con-tacto-api.onrender.com/api/chat"
#     url = f"http://3.112.113.24:3000/api/{endpoint}"
    url = f"http://3.112.113.24/api/{endpoint}"
    
    output_file = "/sd/audio.wav"
    data = prompt
    headers = {
        'Content-Type': 'application/json',
        'Connection': 'close'
    }

    for intento_total in range(3):
        response = None
        try:
            print(f"Intentando descarga completa (intento {intento_total+1})...")

            for intento_conexion in range(3):
                try:
                    response = urequests.post(url, data=ujson.dumps(data), headers=headers)
                    print(response.status_code)
                    if response.status_code != 201:
                        print(f"Error HTTP: {response.status_code}")
                        response.close()
                        raise Exception(f"HTTP {response.status_code}")
                    print("Conexión establecida.")
                    break
                except Exception as e:
                    print(f"Intento conexión {intento_conexion+1} falló:", e)
                    if response is not None:
                        response.close()
                    response = None
                    time.sleep(2)
            else:
                raise Exception("No se pudo establecer conexión tras varios intentos.")

            file_size = int(response.headers.get('Content-Length', 0))
            print(f"Tamaño del archivo: {file_size} bytes" if file_size else "Tamaño desconocido")

            with open(output_file, 'wb') as f:
                chunk_size = 1024
                bytes_written = 0
                while True:
                    chunk = response.raw.read(chunk_size)
                    if chunk:
                        f.write(chunk)
                        bytes_written += len(chunk)
                    else:
                        break
            print(f"\nDescarga completada: {output_file}")
            gc.collect()

            # Intentar reproducir el archivo con reintentos
            for intento_repro in range(3):
                try:
                    print(f"Intentando reproducir (intento {intento_repro+1})...")
                    play_wav_stream(output_file)
                    print("Reproducción exitosa.")
                    break
                except Exception as e:
                    print(f"Error en reproducción intento {intento_repro+1}:", e)
                    time.sleep(1)
            else:
                print("Fallaron todos los intentos de reproducción.")
            break  # éxito total
        except Exception as e:
            print(f"Error en intento {intento_total+1}:", e)
            time.sleep(2)

        finally:
            if response is not None:
                response.close()
                response = None
    else:
        print("Fallaron todos los intentos de descarga.")

"""-----------------------------------------------------------------------------------------"""
dac = DAC(Pin(25))

puntos = [
    Pin(15, Pin.IN, Pin.PULL_DOWN),  # Punto 1
    Pin(2, Pin.IN, Pin.PULL_DOWN),  # Punto 2
    Pin(4, Pin.IN, Pin.PULL_DOWN),  # Punto 3
    Pin(16, Pin.IN, Pin.PULL_DOWN),  # Punto 4
    Pin(17, Pin.IN, Pin.PULL_DOWN),  # Punto 5
    Pin(21, Pin.IN, Pin.PULL_DOWN)   # Punto 6
]

enviar = Pin(22, Pin.IN, Pin.PULL_DOWN)
tts = Pin(12, Pin.IN, Pin.PULL_DOWN)
borrar = Pin(13, Pin.IN, Pin.PULL_DOWN)

braille_a_letra = {
    (0, 0, 0, 0, 0, 1): ' ',
    (1, 0, 0, 0, 0, 0): 'a',
    (1, 1, 0, 0, 0, 0): 'b',
    (1, 0, 0, 1, 0, 0): 'c',
    (1, 0, 0, 1, 1, 0): 'd',
    (1, 0, 0, 0, 1, 0): 'e',
    (1, 1, 0, 1, 0, 0): 'f',
    (1, 1, 0, 1, 1, 0): 'g',
    (1, 1, 0, 0, 1, 0): 'h',
    (0, 1, 0, 1, 0, 0): 'i',
    (0, 1, 0, 1, 1, 0): 'j',
    (1, 0, 1, 0, 0, 0): 'k',
    (1, 1, 1, 0, 0, 0): 'l',
    (1, 0, 1, 1, 0, 0): 'm',
    (1, 0, 1, 1, 1, 0): 'n',
    (1, 0, 1, 0, 1, 0): 'o',
    (1, 1, 1, 1, 0, 0): 'p',
    (1, 1, 1, 1, 1, 0): 'q',
    (1, 1, 1, 0, 1, 0): 'r',
    (0, 1, 1, 1, 0, 0): 's',
    (0, 1, 1, 1, 1, 0): 't',
    (1, 0, 1, 0, 0, 1): 'u',
    (1, 1, 1, 0, 0, 1): 'v',
    (0, 1, 0, 1, 1, 1): 'w',
    (1, 0, 1, 1, 0, 1): 'x',
    (1, 0, 1, 1, 1, 1): 'y',
    (1, 0, 1, 0, 1, 1): 'z',
    (1, 1, 0, 1, 1, 1): 'ñ'
}

palabra = ""

def leer_puntos():
    return [p.value() for p in puntos]

def decodificar_braille():
    estado = tuple(leer_puntos())
    return braille_a_letra.get(estado, '?')

conectar_wifi("Juli", "00000000")
if not init_sd_card():
    print("Abortando por fallo en SD.")
    sys.exit()
    

while True:
    
    letra = decodificar_braille()
    time.sleep(0.3)
    if letra != '?':  
        print("Letra detectada:", letra)
        time.sleep(0.3)
        palabra = palabra + letra
        time.sleep(0.3)
        print("palabra formada: " + palabra)
    if enviar.value()==1 and palabra != "":
        print("enviar " + palabra+" al chat")
        endpoint = "chat"
        data = {
        "prompt": palabra,
        "useGemini": True,
        "test": False,
        "model": "es-PE-AlexNeural",
        "volume": "5%",
        "pitch": "30Hz",
        "rate": "30%"
        }
        conexionApi(data, endpoint)  
        time.sleep(0.3)
        palabra = ""
    if tts.value()==1 and palabra != "":
        print("enviar " + palabra +" al tts")
        endpoint = "tts"
        data = {
        "prompt":palabra,
        "model": "es-PE-AlexNeural",
        "volume": "5%",
        "pitch": "30Hz",
        "rate": "30%"
        }
        conexionApi(data, endpoint)
        time.sleep(0.3)
        palabra = ""
    if borrar.value()==1 and palabra !="":
        palabra = palabra[:-1]
        print(palabra)
        time.sleep(0.3)
        
      
"-----------------------------------------------------------------------------------"