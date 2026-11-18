# Framework de Automatización QA — Playwright + TypeScript (Tricentis Demo Web Shop & API)

Repositorio de pruebas funcionales manuales, pruebas automatizadas End-to-End (UI) y pruebas de **Servicios Web (API)** desarrollado con **Playwright** y **TypeScript** bajo el patrón de diseño **Page Object Model (POM)** para auditar los módulos de **Registro**, **Login** y **Carrito de Compras** de [Tricentis Demo Web Shop](https://demowebshop.tricentis.com/) e interactuar con servicios REST como el endpoint de departamentos de Mercado Libre (`GET https://www.mercadolibre.com.ar/menu/departments`).

## Tabla de Contenidos

1. [Alcance y Cobertura de Pruebas](#1-alcance-y-cobertura-de-pruebas)
2. [Arquitectura del Proyecto (POM + Servicios Web + `docs/`)](#2-arquitectura-del-proyecto-pom--servicios-web--docs)
3. [Requisitos Previos (Instalación desde Cero para QAs)](#3-requisitos-previos-instalación-desde-cero-para-qas)
4. [Instalación del Proyecto y Dependencias](#4-instalación-del-proyecto-y-dependencias)
5. [Ejecución de las Pruebas Automatizadas (UI y API)](#5-ejecución-de-las-pruebas-automatizadas-ui-y-api)
6. [Validación de Screenshots al Fallar un Test y Reporte HTML](#6-validación-de-screenshots-al-fallar-un-test-y-reporte-html)
7. [Guía Paso a Paso para Subir este Proyecto a GitHub por Primera Vez](#7-guía-paso-a-paso-para-subir-este-proyecto-a-github-por-primera-vez)
8. [Cómo Actualizar Cambios desde Visual Studio Code a GitHub](#8-cómo-actualizar-cambios-desde-visual-studio-code-a-github)

## 1. Alcance y Cobertura de Pruebas

El framework automatiza los **6 casos clave de UI** definidos en el Plan de Pruebas, **1 caso de Servicios Web (API)** contra Mercado Libre y **1 caso de falla forzada** que reproduce un defecto real del sistema para verificar la captura automática de pantallas (`screenshots`) ante errores:

| ID Caso | Módulo | Archivo de Prueba | Escenario Validado | Resultado Esperado |
| ----- | ----- | ----- | ----- | ----- |
| **AUT-REG-01** | Registro (UI) | `tests/register.spec.ts` | Alta de usuario nuevo con correo dinámico único | Redirige a la home y muestra el email + `Log out` en la barra superior (`PASS`) |
| **AUT-REG-02** | Registro (UI) | `tests/register.spec.ts` | Intento de registro con email ya existente | Impide el alta y muestra `"The specified email already exists"` (`PASS`) |
| **AUT-LOGIN-01** | Login (UI) | `tests/login.spec.ts` | Login exitoso con credenciales válidas | Redirige a la home y muestra el email + `Log out` en la barra superior (`PASS`) |
| **AUT-LOGIN-02** | Login (UI) | `tests/login.spec.ts` | Login fallido con contraseña incorrecta | Permanece en `/login` y muestra el error de credenciales inválidas (`PASS`) |
| **AUT-CART-02** | Carrito (UI) | `tests/cart.spec.ts` | Cálculo de subtotales y total con múltiples ítems (Ítem A x2 + Ítem B x1) | Contador en `(3)`, subtotales exactos (`20.00` y `24.00`) y total `44.00` (`PASS`) |
| **AUT-CART-03** | Carrito (UI) | `tests/cart.spec.ts` | Eliminación simultánea de Ítem A e Ítem B conservando Ítem C | Elimina A y B, conserva C, baja el contador a `(1)` y recalcula el total (`PASS`) |
| **AUT-API-01** | Servicios Web (API) | `tests/api-mercadolibre.spec.ts` | Petición `GET https://www.mercadolibre.com.ar/menu/departments` | Devuelve status `200 OK` y el cuerpo JSON contiene la propiedad `"departments"` (`PASS`) |
| **BUG-CART-01** | Carrito *(Falla Forzada)* | `tests/forced-failure-bug.spec.ts` | Ingreso de `9999999999` en `Qty` esperando el error `"The maximum quantity allowed for purchase is 10000."` | **Falla controlada**: la web no muestra el mensaje de error y Playwright guarda la screenshot de evidencia (`FAIL` esperado) |

## 2. Arquitectura del Proyecto (POM + Servicios Web + `docs/`)

El código sigue principios de **Clean Code**, tipado estricto en TypeScript y separación de responsabilidades mediante **Page Object Model (POM)** para la interfaz gráfica y **Clientes de Servicio (`BaseApiClient`)** sobre `APIRequestContext` de Playwright para interactuar con servicios web:

```text
tricentis-demowebshop-playwright/
├── docs/                                  # Documentación funcional y manual de QA
│   ├── 01-test-plan.md                    # Plan de Pruebas, Alcance y Suites (Smoke / Regresión)
│   ├── 02-manual-test-cases.md            # Casos de prueba manuales (LOGIN-01..03, CART-01..03) y matriz automatizada
│   ├── 03-bug-reports.md                  # Reporte detallado de bugs (BUG-CART-01 y BUG-LOGIN-01)
│   ├── 04-api-testing-strategy.md         # Estrategia de pruebas de API y casos API-01 / AUT-API-01
│   └── Test Plan - Tricentis Demo Web Shop.docx  # Documento original completo
├── src/
│   ├── types/
│   │   └── index.ts                       # Interfaces estrictas (UI y MercadoLibreDepartmentsResponse)
│   ├── data/
│   │   └── testData.ts                    # Datos de prueba desacoplados, credenciales, productos y endpoints API
│   ├── api/
│   │   ├── BaseApiClient.ts               # Cliente HTTP base reutilizable (GET/POST con APIRequestContext)
│   │   └── MercadoLibreApiService.ts      # Servicio web para consultar endpoints de Mercado Libre
│   ├── pages/
│   │   ├── BasePage.ts                    # Clase base con selectores y validaciones de la barra superior
│   │   ├── RegisterPage.ts                # Page Object del módulo de Registro (/register)
│   │   ├── LoginPage.ts                   # Page Object del módulo de Login (/login)
│   │   ├── ProductPage.ts                 # Page Object de ficha de producto y adición al carrito
│   │   └── ShoppingCartPage.ts            # Page Object del Carrito de Compras (/cart)
│   └── fixtures/
│       └── baseTest.ts                    # Fixture que inyecta Page Objects, Servicios API y captura screenshots
├── tests/
│   ├── screenshots/                       # Carpeta donde se guardan las screenshots legibles cuando falla un test
│   ├── register.spec.ts                   # Suite automatizada de Registro (AUT-REG-01, AUT-REG-02)
│   ├── login.spec.ts                      # Suite automatizada de Login (AUT-LOGIN-01, AUT-LOGIN-02)
│   ├── cart.spec.ts                       # Suite automatizada de Carrito (AUT-CART-02, AUT-CART-03)
│   ├── api-mercadolibre.spec.ts           # Suite automatizada de Servicios Web / API (AUT-API-01)
│   └── forced-failure-bug.spec.ts         # Test de falla forzada (BUG-CART-01) para verificar screenshots
├── playwright.config.ts                   # Configuración de Playwright para Google Chrome y reporte HTML
├── tsconfig.json                          # Configuración estricta del compilador TypeScript
├── package.json                           # Dependencias y scripts de ejecución rápida
└── README.md                              # Guía completa de instalación, uso y actualización en GitHub
```

## 3. Requisitos Previos (Instalación desde Cero para QAs)

Si nunca ejecutaste pruebas automatizadas antes, solo necesitás instalar estas **4 herramientas gratuitas** en tu computadora:

1. **Google Chrome** (Navegador donde correrán las pruebas):
   * Descargalo desde <https://www.google.com/chrome/>.
2. **Node.js (Versión LTS recomendada: v20 o superior)**:
   * Descargá el instalador desde <https://nodejs.org/> y seguí los pasos con las opciones por defecto.
   * Para verificar que se instaló bien, abrí una terminal (`PowerShell` o `CMD` en Windows, o `Terminal` en Mac/Linux) y ejecutá:
     ```bash
     node -v
     npm -v
     ```
   * *(Nota para usuarios de Windows PowerShell)*: Si al ejecutar `npm` ves un aviso sobre *Execution Policies*, ejecutá una sola vez este comando en PowerShell y respondé `S` o `Y`:
     ```powershell
     Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
     ```
3. **Git** (Para clonar o subir el repositorio a GitHub):
   * Descargalo desde <https://git-scm.com/>.
4. **Visual Studio Code (VS Code)** *(Opcional pero muy recomendado)*:
   * Descargalo desde <https://code.visualstudio.com/>.

## 4. Instalación del Proyecto y Dependencias

Seguí estos pasos en tu terminal:

### Paso 1: Clonar el repositorio (o descomprimir la carpeta del proyecto)
Si ya está subido a GitHub:
```bash
git clone https://github.com/TU_USUARIO/tricentis-demowebshop-playwright.git
cd tricentis-demowebshop-playwright
```
*(Si descargaste el archivo `.zip`, descomprimilo, abrí la carpeta en VS Code y abrí una terminal integrada con `Ctrl + Ñ` o desde el menú `Terminal -> New Terminal`).*

### Paso 2: Instalar las dependencias de Node.js (`@playwright/test` y `typescript`)
```bash
npm install
```

### Paso 3: Instalar los binarios del navegador para Playwright
```bash
npx playwright install chrome
```

## 5. Ejecución de las Pruebas Automatizadas (UI y API)

Podés usar cualquiera de los comandos preconfigurados en `package.json`:

| Qué querés ejecutar | Comando a correr en la terminal |
| ----- | ----- |
| **Correr TODOS los tests** (UI + API + el test de falla forzada) | `npm test` |
| **Correr únicamente la prueba de Servicio Web / API de Mercado Libre (`AUT-API-01`)** | `npm run test:api` |
| **Correr los 7 casos exitosos (Registro, Login, Carrito y API)** | `npx playwright test tests/register.spec.ts tests/login.spec.ts tests/cart.spec.ts tests/api-mercadolibre.spec.ts` |
| **Correr los tests viendo el navegador Chrome abrirse en pantalla** (*Headed mode*) | `npm run test:headed` |
| **Abrir la interfaz interactiva de Playwright (UI Mode)** | `npm run test:ui` |
| **Correr únicamente las pruebas de Registro (`AUT-REG-01` y `02`)** | `npm run test:register` |
| **Correr únicamente las pruebas de Login (`AUT-LOGIN-01` y `02`)** | `npm run test:login` |
| **Correr únicamente las pruebas de Carrito (`AUT-CART-02` y `03`)** | `npm run test:cart` |
| **Correr únicamente la prueba de Falla Forzada (`BUG-CART-01`)** | `npm run test:bug` |
| **Verificar que no haya errores de tipos en TypeScript** | `npm run typecheck` |

## 6. Validación de Screenshots al Fallar un Test y Reporte HTML

El framework está configurado en dos niveles para que nunca se pierda la evidencia visual cuando falla una prueba UI:

1. **En `playwright.config.ts`**: Se define `screenshot: 'only-on-failure'`, lo cual genera una captura automática en la carpeta `test-results/` y la incrusta en el reporte HTML.
2. **En `src/fixtures/baseTest.ts`**: Un hook `test.afterEach` detecta cualquier test UI cuyo estado sea distinto al esperado y guarda una captura de página completa directamente en `tests/screenshots/FAILED_<nombre_del_test>.png`, además de adjuntarla al reporte bajo el nombre **"Evidencia de Falla (Screenshot)"**.

### Cómo probarlo paso a paso:
1. Ejecutá el caso de prueba de falla forzada:
   ```bash
   npm run test:bug
   ```
2. Verás que el test `BUG-CART-01 (Falla Forzada)` falla porque la tienda no muestra el mensaje `"The maximum quantity allowed for purchase is 10000."`.
3. Revisá la carpeta `tests/screenshots/`: encontrarás la imagen `FAILED_bug-cart-01_falla_forzada_validar_mensaje_de_error_al_ingresar_9999999999_en_qty_del_carrito.png`.
4. Abrí el reporte HTML interactivo ejecutando:
   ```bash
   npm run report
   ```

## 7. Guía Paso a Paso para Subir este Proyecto a GitHub por Primera Vez

Si todavía no habías subido el proyecto a GitHub:

1. Ingresá a <https://github.com/new> con tu cuenta de GitHub.
2. En **Repository name**, escribí por ejemplo: `tricentis-demowebshop-playwright`.
3. Seleccioná **Public** (Público) y hacé clic en **Create repository** (sin marcar README ni .gitignore).
4. Abrí la terminal integrada de VS Code (`Ctrl + Ñ`) y ejecutá:
   ```bash
   git init
   git add .
   git commit -m "feat: framework de automatizacion Playwright + TS y documentacion QA"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/tricentis-demowebshop-playwright.git
   git push -u origin main
   ```

## 8. Cómo Actualizar Cambios desde Visual Studio Code a GitHub

Cada vez que agregues nuevos archivos (como la carpeta `src/api/` y el test `tests/api-mercadolibre.spec.ts`) o modifiques archivos existentes en tu proyecto, podés subir los cambios a tu repositorio de GitHub de **dos maneras** desde Visual Studio Code:

### Opción A: Desde la Terminal Integrada de VS Code (Recomendada y rápida)
1. Abrí la carpeta de tu proyecto en **Visual Studio Code** y copiá/reemplazá los archivos nuevos o modificados.
2. Abrí la terminal integrada presionando **`Ctrl + Ñ`** (o desde el menú superior `Terminal -> New Terminal`).
3. Verificá qué archivos detectó Git como nuevos o modificados:
   ```bash
   git status
   ```
   *(Vas a ver en color rojo/verde `src/api/`, `tests/api-mercadolibre.spec.ts`, `src/fixtures/baseTest.ts`, `package.json`, `README.md`, etc.).*
4. Prepará todos los archivos nuevos y editados para el envío (*Stage*):
   ```bash
   git add .
   ```
5. Guardá el paquete de cambios con un mensaje descriptivo (*Commit*):
   ```bash
   git commit -m "feat(api): agregar cliente de servicios web y test GET departments de Mercado Libre"
   ```
6. Subí los cambios a tu repositorio en GitHub (*Push*):
   ```bash
   git push
   ```
   *(Si es la primera vez que hacés push en esa rama, usá `git push -u origin main`).*

### Opción B: Desde el Panel Visual de Control de Código Fuente de VS Code (Sin comandos)
1. En la barra lateral izquierda de VS Code, hacé clic en el ícono de **Control de código fuente (Source Control)** (el tercer ícono con forma de ramificación, o presionando `Ctrl + Shift + G`).
2. En la lista **Changes (Cambios)**, pasá el mouse por encima de la palabra *Changes* y hacé clic en el botón **`+` (Stage All Changes)** para preparar todos los archivos modificados y nuevos.
3. Arriba, en el cuadro de texto **Message**, escribí el mensaje del commit, por ejemplo:
   `feat(api): agregar soporte para servicios web y test de Mercado Libre`
4. Hacé clic en el botón azul **Commit** (o **Confirmar**).
5. Finalmente, hacé clic en el botón **Sync Changes** (o **Push / Subir cambios**) que aparece en el mismo lugar para impactar los cambios en tu repositorio público de GitHub.
