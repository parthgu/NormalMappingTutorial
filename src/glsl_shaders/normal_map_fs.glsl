precision mediump float;

uniform sampler2D textureSampler;
uniform bool uHasNormalMap;
uniform sampler2D normalSampler;
uniform vec4 uAmbientColor;

uniform float uMaterialDiffuseWeight;
uniform float uMaterialSpecularWeight;
uniform float uMaterialShininess;

varying vec2 vTexCoord;
varying vec3 vFragPos;

struct Light{
    bool Active;
    vec3 Pos;
    vec4 Color;
    vec2 Falloff;
    bool HasDiffuse;
    bool HasSpec;
};

uniform Light uLights[8];

vec3 normalZero = vec3(0.5, 0.5, 0.5);

void main(void)  {
    vec4 textureColor = texture2D(textureSampler, vTexCoord);
    vec3 normal = vec3(0.0);
    if (uHasNormalMap) {
        normal = texture2D(normalSampler, vTexCoord).rgb;
        normal = normalize(normal - normalZero);
    } else {
        normal = vec3(0.0, 0.0, 1.0);
    }
    
    vec4 result = textureColor;
    vec3 Ambient = uAmbientColor.rgb * uAmbientColor.a;

    if (textureColor.a > 0.9) {
        vec3 diffuse = vec3(0.0);
        vec3 specular = vec3(0.0);
        vec3 lightIncident = vec3(0.0);
        vec3 lightReflect = vec3(0.0);

        float Attenuation = 0.0;

        for(int i = 0; i < 8; i++) {
            if(uLights[i].Active) {
                lightIncident = normalize(vFragPos - uLights[i].Pos);
                lightReflect = reflect(lightIncident, normal);

                float D = length(uLights[i].Pos - vFragPos);
                if (D <= uLights[i].Falloff.x) {
                    Attenuation = 1.0;
                } else { // attenuation between near and far distances
                    float factor = D - uLights[i].Falloff.x;
                    float total = uLights[i].Falloff.y;
                    Attenuation = smoothstep(0.0, 1.0,
                        1.0 - (factor * factor) / (total * total));
                }
            
                if (uLights[i].HasDiffuse) {
                    diffuse += max(0.0, dot(normal, normalize(uLights[i].Pos - vFragPos)))
                        * Attenuation * uMaterialDiffuseWeight * uLights[i].Color.rgb * uLights[i].Color.a;
                }

                if (uLights[i].HasSpec) {
                    specular += pow(max(0.0, lightReflect.z), uMaterialShininess)
                        * Attenuation * uMaterialSpecularWeight * uLights[i].Color.rgb * uLights[i].Color.a;
                }
            }
        }
        
        result = vec4((Ambient + diffuse + specular) * vec3(result), 1.0);
    }
    gl_FragColor = result;
}
