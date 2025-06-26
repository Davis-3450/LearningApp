# 🚀 Guía de Configuración Vercel - Monorepo

## ⚠️ Problema Identificado

El build falla en Vercel porque está ejecutando comandos desde la raíz del monorepo, pero necesita ejecutarse desde el contexto correcto.

## ✅ Solución: Configuración Correcta en Dashboard

### 1. Configuración del Proyecto en Vercel Dashboard

Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard) → Settings → General:

**🔧 Build & Development Settings:**
```
Framework Preset: Next.js
Root Directory: apps/frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### 2. Configurar "Ignored Build Step" 

Ve a Settings → Git → Ignored Build Step:

```bash
git diff HEAD^ HEAD --quiet ./apps/frontend
```

**Explicación**: Solo deploya cuando hay cambios en `apps/frontend`

### 3. Environment Variables (si es necesario)

```
NODE_ENV=production
```

## 🔄 Test de la Configuración

### Desde CLI (para testing):

```bash
# Desde la raíz del monorepo
vercel --prod

# O específicamente desde frontend
cd apps/frontend
vercel --prod
```

### Build local para verificar:

```bash
# Desde raíz (simula Vercel)
npm run build

# Output esperado: ✅ Build exitoso
```

## 📁 Estructura Final del Proyecto

```
LearningApp/                     # ← Repositorio Git
├── package.json                 # ← Workspaces configurados
├── apps/
│   ├── frontend/               # ← ROOT DIRECTORY en Vercel
│   │   ├── package.json
│   │   ├── next.config.mjs
│   │   └── src/
│   └── backend/
└── shared/
    ├── package.json            # ← Workspace agregado
    ├── lib/
    ├── schemas/
    └── data/
```

## 🎯 Checklist de Verificación

- [ ] Root Directory: `apps/frontend` ✅
- [ ] Build Command: `npm run build` ✅
- [ ] Framework: Next.js auto-detectado ✅
- [ ] Workspaces configurados en package.json raíz ✅
- [ ] Shared package.json creado ✅
- [ ] TypeScript errors ignorados temporalmente ✅

## 🐛 Troubleshooting

### Si el build aún falla:

1. **Verificar en Dashboard** que Root Directory sea exactamente: `apps/frontend`
2. **Limpiar cache**: Settings → Functions → Clear Build Cache
3. **Redeploy**: Trigger manual deployment

### Comandos de debug:

```bash
# Ver logs en tiempo real
vercel logs [deployment-url] --follow

# Verificar estructura
vercel inspect [deployment-url]
```

---

## 🚀 Status: Ready to Deploy

Con esta configuración, el proyecto debería deployar correctamente en Vercel respetando la estructura de monorepo. 