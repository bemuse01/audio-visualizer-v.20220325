export default {
    executeNormalizing(){
        return `
            float executeNormalizing(float x, float a, float b, float min, float max){
                return (b - a) * (x - min) / (max - min) + a;
            }
        `
    },
    getTheta(){
        return `
            float getTheta(vec2 pos){
                return atan(pos.y, pos.x);
            }
        `
    },
    getSphereCoord(){
        return `
            vec3 getSphereCoord(float lat, float lon, float radius){
                float phi = (90.0 - lat) * ${RADIAN};
                float theta = (180.0 - lon) * ${RADIAN};
                float x = radius * sin(phi) * cos(theta);
                float y = radius * cos(phi);
                float z = radius * sin(phi) * sin(theta);
                return vec3(x, y, z);
            }
        `
    },
    getCircleCoord(){
        return `
            vec2 getCircleCoord(float deg, float radius){
                float x = radius * cos(deg);
                float y = radius * sin(deg);
                return vec2(x, y);
            }
        `
    },
    rand(){
        return `
            float rand(vec2 co){
                return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
            }
        `
    },
    snoise3D(){
        return `
            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
            
            float snoise3D(vec3 v){ 
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 =   v - i + dot(i, C.xxx) ;
                
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                
                vec3 x1 = x0 - i1 + 1.0 * C.xxx;
                vec3 x2 = x0 - i2 + 2.0 * C.xxx;
                vec3 x3 = x0 - 1. + 3.0 * C.xxx;
                
                i = mod(i, 289.0 ); 
                vec4 p = permute( permute( permute( 
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                
                float n_ = 1.0/7.0; // N=7
                vec3  ns = n_ * D.wyz - D.xzx;
                
                vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)
                
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
                
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
            }
        `
    },
    createRing(){
        return `
            float ring(vec2 coords, vec2 center, float radius, float thickness, float blur){
                float calculatedRadius = length(coords - center);
                float innerRadius = radius - thickness;
            
                float pctOuterCircle = 1.0 - smoothstep(radius - blur, radius, calculatedRadius);
                float outerCirclePaint = mix(0.0, 1.0, pctOuterCircle);
                
                float pctInnerCircle = 1.0 - smoothstep(innerRadius - blur, innerRadius, calculatedRadius);
                float innerCirclePaint = mix(outerCirclePaint, 0.0, pctInnerCircle);
            
                return innerCirclePaint;
            }
        `
    },
    blur13(){
        return `
            vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
                vec4 color = vec4(0.0);
                vec2 off1 = vec2(1.411764705882353) * direction;
                vec2 off2 = vec2(3.2941176470588234) * direction;
                vec2 off3 = vec2(5.176470588235294) * direction;
                color += texture2D(image, uv) * 0.1964825501511404;
                color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
                color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
                color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
                color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
                color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
                color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
                return color;
            }
        `
    },
    blur9(){
        return `
            vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
                vec4 color = vec4(0.0);
                vec2 off1 = vec2(1.3846153846) * direction;
                vec2 off2 = vec2(3.2307692308) * direction;
                color += texture2D(image, uv) * 0.2270270270;
                color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
                color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
                color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
                color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
                return color;
            }
        `
    },
    blur5(){
        return `
            vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
                vec4 color = vec4(0.0);
                vec2 off1 = vec2(1.3333333333333333) * direction;
                color += texture2D(image, uv) * 0.29411764705882354;
                color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
                color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
                return color; 
            }
        `
    },
    snoise4D(){
        return `
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            float permute(float x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float taylorInvSqrt(float r) { return 1.79284291400159 - 0.85373472095314 * r; }
          
            vec4 grad4(float j, vec4 ip){
                const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
                vec4 p,s;
            
                p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
                p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
                s = vec4(lessThan(p, vec4(0.0)));
                p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
            
                return p;
            }
          
            #define F4 0.309016994374947451
          
            float snoise4D(vec4 v){
                const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                                    0.276393202250021,  // 2 * G4
                                    0.414589803375032,  // 3 * G4
                                    -0.447213595499958); // -1 + 4 * G4
            
                vec4 i  = floor(v + dot(v, vec4(F4)) );
                vec4 x0 = v -   i + dot(i, C.xxxx);
            
                vec4 i0;
                vec3 isX = step( x0.yzw, x0.xxx );
                vec3 isYZ = step( x0.zww, x0.yyz );
                i0.x = isX.x + isX.y + isX.z;
                i0.yzw = 1.0 - isX;
                i0.y += isYZ.x + isYZ.y;
                i0.zw += 1.0 - isYZ.xy;
                i0.z += isYZ.z;
                i0.w += 1.0 - isYZ.z;
            
                vec4 i3 = clamp( i0, 0.0, 1.0 );
                vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
                vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
            
                vec4 x1 = x0 - i1 + C.xxxx;
                vec4 x2 = x0 - i2 + C.yyyy;
                vec4 x3 = x0 - i3 + C.zzzz;
                vec4 x4 = x0 + C.wwww;
            
                i = mod289(i);
                float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
                vec4 j1 = permute( permute( permute( permute (
                        i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                        + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                        + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
                        + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
            
                vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
            
                vec4 p0 = grad4(j0,   ip);
                vec4 p1 = grad4(j1.x, ip);
                vec4 p2 = grad4(j1.y, ip);
                vec4 p3 = grad4(j1.z, ip);
                vec4 p4 = grad4(j1.w, ip);
            
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                p4 *= taylorInvSqrt(dot(p4,p4));
            
                vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
                vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
                m0 = m0 * m0;
                m1 = m1 * m1;
                return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                            + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
            }
        `
    }
}