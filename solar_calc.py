
import math

"""
Equation of Time (EoT) Function
    - day_number (1-365) since start of the New Year
    - beta (β) in orbital equations is the day angle used to solve for EoT (we are converting it to radians as math.sin() requires a radians) 
"""
def equation_of_time(day_number: int) -> float:
    beta = 2 * math.pi * (day_number - 81) / 365
    return 9.87 * math.sin(2*beta) - 7.53 * math.cos(beta) - 1.5 * math.sin(beta)


"""
Declination Angle (δ) Function
    The declination angle, varies seasonally due to the tilt of the earth on its axis of rotation and the rotation of the earth around the sun. If the Earth were not tilted on its axis of rotation, the declination would always be 0
"""

def declination_angle(day_number: int) -> float:
    return 23.45 * math.sin(math.radians(360/365 * (day_number - 81)))

"""
Solar Power Plants (SPP) Angles Function 
    The efficient operation of a SPP project is directly related not only to the panel quality but also to the ngles where the panel is positioned.
        - Altitude Angle 
        - Zenith Angle
        - Azimuth Angle
    Inputs:
        - latitude       φ (in degrees) [North Positive)]
        - longitude      λ (in degrees) [West Negative]
        - lstm           Local Standard Time Meridian
        - hour           Will Be Convereted to Local Solar Time
        - minute         Will Be Convereted to Local Solar Time
"""
def spp_angles(day_number, latitiude, longitude, lstm, hour, minute):

    # EoT and Local Solar Time (LST)
    EoT = equation_of_time(day_number)
    tc = 4 * (longitude - lstm) + EoT
    local_time = hour + minute/60
    lst = local_time + tc/60     

    # Hour Angle (HRA) and Declination Angle
    hra = 15 * (lst - 12)  # degrees
    decl = declination_angle(day_number) # degrees

    # Angles converted to radians
    phi = math.radians(latitiude)
    delta = math.radians(decl)
    hra_rad = math.radians(hra)

    # Altitude Angle (α)
    sin_altitude_angle = math.sin(phi)*math.sin(delta) + math.cos(phi)*math.cos(delta)*math.cos(hra_rad)
    sin_alpha = max(-1.0, min(1.0, sin_altitude_angle))
    solar_altitude_angle = math.degrees(math.asin(sin_altitude_angle)) # degrees

    # Zentih Angle (α_s)
    zenith_angle = 90 - solar_altitude_angle # degree

    # Azmith Angle (γ)
    alpha_rad = math.radians(solar_altitude_angle)
    sin_gamma = (math.cos(delta) * math.sin(hra_rad)) / math.cos(alpha_rad)
    cos_gamma = (math.sin(alpha_rad)*math.sin(phi) - math.sin(delta)) / (math.cos(alpha_rad) * math.cos(phi))
    azimuth_angle = math.degrees(math.atan2(sin_gamma, cos_gamma))
    azimuth_angle = (azimuth_angle + 180) % 360 # normalize to compass azimuth

    return solar_altitude_angle, zenith_angle, azimuth_angle, delta, hra_rad, alpha_rad

"""
Solar Irradiance Function
    Solar irradiance is the power per unit area received from the sun, measured in watts per square meter W/m^{2}. It directly determines the amount of electricity that can be generated at any given time
    Inputs: 
        - phi, detla, hra_rad, alpha_rad    angles converted to radians for function use
        - tilt_angle                        angle of solar panel to ground (0-90)
        - panel_azimuth                     0 (North), 90 (East), 180 (South), 270 (West)
"""

def solar_irrdiance(day_number, phi, delta, hra_rad, alpha_rad, tilt_angle, panel_azimuth):
    
    # Constants
    I_0 = 1361.0     # solar constant
    k = 0.149        # Atmospheric optical depth (k) 
    C = 0.06         # Diffuse empirical constant
    p = 0.2          # Reflected Irradiance on Tilted Surface [assume p=0.2]

    # sun below horizon
    if alpha_rad <= 0:
        return 0.0, 0.0, 0.0, 0.0

    beta = math.radians(tilt_angle)
    gamma_p = math.radians(panel_azimuth)

    # Angle of incidence (i)
    cos_i = (
        math.sin(delta) * math.sin(phi) * math.cos(beta) 
        - math.sin(delta) * math.cos(phi) * math.sin(beta) * math.cos(gamma_p)
        + math.cos(delta) * math.cos(phi) * math.cos(beta) * math.cos(hra_rad)
        + math.cos(delta) * math.sin(phi) * math.sin(beta) * math.cos(gamma_p)
        + math.cos(delta) * math.sin(phi) * math.sin(gamma_p) * math.sin(hra_rad)
    )
    cos_i = max(-1.0, min(1.0, cos_i))

    angle_of_incidence = math.degrees(math.acos(cos_i)) # degree

    # Solar irradiance (I)
    I = I_0 * (1 + 0.034 * math.cos(math.radians(360 * day_number / 365)))

    # Beam Irradiance (I_bn)
    I_bn = I_0 * math.exp(-k / math.sin(alpha_rad))

    # Diffuse horizontal irradiance
    I_bc = I_bn * cos_i

    # Diffuse Irradiance on Tilted Surface (I_dc)
    I_dh = C * I_bn * (math.sin(alpha_rad))

    # Diffuse on tilted surface
    I_dc = I_dh * ( 1 + math.cos(math.radians(tilt_angle)) / 2)

    # Global Horizontal Irradiance (I_gh)
    I_gh = I_bn * math.sin(alpha_rad) + I_dh  

    # Reflected Irradiance on Tilted Surface (I_rc)
    I_rc = p * I_gh * (1.0 - math.cos(beta)) / 2

    # Total Irradiance on Tilted Surface (I_c)
    I_c =  I_bc + I_dc + I_rc

    return I_bn, I_dc, I_rc, I_c


"""
Call Function
    Inputs:
    - day_number            (1-365) since start of the New Year
    - latitude              φ (in degrees)
    - longitude             λ (in degrees)
    - lstm                  Local Standard Time Meridian
    - hour, minute          time u want to check
    - tilt_angle            angle of solar panel to ground (0-90)
    - panel_azimuth         0 (North), 90 (East), 180 (South), 270 (West) 360 (East)
"""

if __name__ == "__main__":
    day_number = 200    # July 19
    longitude = - 74
    latitude = 40
    lstm = -75
    hour, minute = 12, 16
    tilt_angle = 30
    panel_azimuth = 0   

    altitude, zenith, azimuth, delta, hra_rad, alpha_rad = spp_angles(
        day_number, latitude, longitude, lstm, hour, minute
    )

    I_bn, I_dc, I_rc, I_c = solar_irrdiance(day_number, math.radians(latitude),
        delta, hra_rad, alpha_rad, tilt_angle, panel_azimuth)
    
    print("\n", "=== Results ==") 
    print(f"Solar Altitude: {altitude:.2f}°") 
    print(f"Zenith Angle: {zenith:.2f}°") 
    print(f"Azimuth Angle: {azimuth:.2f}°") 
    print(f"Total Irradiance (Ic): {I_c:.2f} W/m²")