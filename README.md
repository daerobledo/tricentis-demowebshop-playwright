# Framework de Automatización QA — Playwright + TypeScript (Tricentis Demo Web Shop)

Repositorio de pruebas funcionales manuales y automatizadas (End-to-End) desarrollado con **Playwright** y **TypeScript** bajo el patrón de diseño **Page Object Model (POM)** para auditar los módulos de **Registro**, **Login** y **Carrito de Compras** de [Tricentis Demo Web Shop](https://demowebshop.tricentis.com/).

## Tabla de Contenidos

1. [Alcance y Cobertura de Pruebas](https://www.google.com/search?q=%231-alcance-y-cobertura-de-pruebas)

2. [Arquitectura del Proyecto y Carpeta `docs/`](https://www.google.com/search?q=%232-arquitectura-del-proyecto-y-carpeta-docs)

3. [Requisitos Previos (Instalación desde Cero para QAs)](https://www.google.com/search?q=%233-requisitos-previos-instalaci%C3%B3n-desde-cero-para-qas)

4. [Instalación del Proyecto y Dependencias](https://www.google.com/search?q=%234-instalaci%C3%B3n-del-proyecto-y-dependencias)

5. [Ejecución de las Pruebas Automatizadas](https://www.google.com/search?q=%235-ejecuci%C3%B3n-de-las-pruebas-automatizadas)

6. [Validación de Screenshots al Fallar un Test y Reporte HTML](https://www.google.com/search?q=%236-validaci%C3%B3n-de-screenshots-al-fallar-un-test-y-reporte-html)

7. [Guía Paso a Paso para Subir este Proyecto a GitHub](https://www.google.com/search?q=%237-gu%C3%ADa-paso-a-paso-para-subir-este-proyecto-a-github)

## 1. Alcance y Cobertura de Pruebas

El framework automatiza los **6 casos clave** definidos en el Plan de Pruebas más **1 caso de falla forzada** que reproduce un defecto real del sistema para verificar la captura automática de pantallas (`screenshots`) ante errores:

| ID Caso | Módulo | Archivo de Prueba | Escenario Validado | Resultado Esperado | 
| ----- | ----- | ----- | ----- | ----- | 
| **AUT-REG-01** | Registro | `tests/register.spec.ts` | Alta de usuario nuevo con correo dinámico único | Redirige a la home y muestra el email + `Log out` en la barra superior (`PASS`) | 
| **AUT-REG-02** | Registro | `tests/register.spec.ts` | Intento de registro con email ya existente | Impide el alta y muestra `"The specified email already exists"` (`PASS`) | 
| **AUT-LOGIN-01** | Login | `tests/login.spec.ts` | Login exitoso con credenciales válidas | Redirige a la home y muestra el email + `Log out` en la barra superior (`PASS`) | 
| **AUT-LOGIN-02** | Login | `tests/login.spec.ts` | Login fallido con contraseña incorrecta | Permanece en `/login` y muestra el error de credenciales inválidas (`PASS`) | 
| **AUT-CART-02** | Carrito | `tests/cart.spec.ts` | Cálculo de subtotales y total con múltiples ítems (Ítem A x2 + Ítem B x1) | Contador en `(3)`, subtotales exactos (`20.00` y `24.00`) y total `44.00` (`PASS`) | 
| **AUT-CART-03** | Carrito | `tests/cart.spec.ts` | Eliminación simultánea de Ítem A e Ítem B conservando Ítem C | Elimina A y B, conserva C, baja el contador a `(1)` y recalcula el total (`PASS`) | 
| **BUG-CART-01** | Carrito *(Falla Forzada)* | `tests/forced-failure-bug.spec.ts` | Ingreso de `9999999999` en `Qty` esperando el error `"The maximum quantity allowed for purchase is 10000."` | **Falla controlada**: la web no muestra el mensaje de error y Playwright guarda la screenshot de evidencia (`FAIL` esperado) | 

## 2. Arquitectura del Proyecto y Carpeta `docs/`

El código sigue principios de **Clean Code**, tipado estricto en TypeScript y separación de responsabilidades mediante **Page Object Model (POM)**:

```
tricentis-demowebshop-playwright/
├── docs/                                  # Documentación funcional y manual de QA
│   ├── 01-test-plan.md                    # Plan de Pruebas, Alcance y Suites (Smoke / Regresión)
│   ├── 02-manual-test-cases.md            # Casos de prueba manuales (LOGIN-01..03, CART-01..03) y matriz automatizada
│   ├── 03-bug-reports.md                  # Reporte detallado de bugs (BUG-CART-01 y BUG-LOGIN-01)
│   ├── 04-api-testing-strategy.md         # Estrategia de pruebas de API y caso documentado API-01
│   └── Test Plan - Tricentis Demo Web Shop.docx  # Documento original completo
├── src/
│   ├── types/
│   │   └── index.ts                       # Interfaces y tipos estrictos (RegisterUserData, LoginCredentials, ProductTestData)
│   ├── data/
│   │   └── testData.ts                    # Datos de prueba desacoplados, credenciales, productos y mensajes esperados
│   ├── pages/
│   │   ├── BasePage.ts                    # Clase base con selectores y validaciones de la barra superior
│   │   ├── RegisterPage.ts                # Page Object del módulo de Registro (/register)
│   │   ├── LoginPage.ts                   # Page Object del módulo de Login (/login)
│   │   ├── ProductPage.ts                 # Page Object de ficha de producto y adición al carrito
│   │   └── ShoppingCartPage.ts            # Page Object del Carrito de Compras (/cart)
│   └── fixtures/
│       └── baseTest.ts                    # Fixture personalizado que inyecta Page Objects y captura screenshots al fallar
├── tests/
│   ├── screenshots/                       # Carpeta donde se guardan las screenshots legibles cuando falla un test
│   ├── register.spec.ts                   # Suite automatizada de Registro (AUT-REG-01, AUT-REG-02)
│   ├── login.spec.ts                      # Suite automatizada de Login (AUT-LOGIN-01, AUT-LOGIN-02)
│   ├── cart.spec.ts                       # Suite automatizada de Carrito (AUT-CART-02, AUT-CART-03)
│   └── forced-failure-bug.spec.ts         # Test de falla forzada (BUG-CART-01) para verificar screenshots
├── playwright.config.ts                   # Configuración de Playwright para Google Chrome y reporte HTML
├── tsconfig.json                          # Configuración estricta del compilador TypeScript
├── package.json                           # Dependencias y scripts de ejecución rápida
└── README.md                              # Guía completa de instalación, uso y despliegue en GitHub

```

## 3. Requisitos Previos (Instalación desde Cero para QAs)

Si nunca ejecutaste pruebas automatizadas antes, solo necesitás instalar estas **4 herramientas gratuitas** en tu computadora:

1. **Google Chrome** (Navegador donde correrán las pruebas):

   * Descargalo desde <https://www.google.com/chrome/>.

2. **Node.js (Versión LTS recomendada: v20 o superior)**:

   * Descargá el instalador desde <https://nodejs.org/> y seguí los pasos con las opciones por defecto.

   * Para verificar que se instaló bien, abrí una terminal (`PowerShell` o `CMD` en Windows, o `Terminal` en Mac/Linux) y ejecutá:

     ```
     node -v
     npm -v
     
     ```

   * *(Nota para usuarios de Windows PowerShell)*: Si al ejecutar `npm` ves un aviso sobre *Execution Policies*, ejecutá una sola vez este comando en PowerShell y respondé `S` o `Y`:

     ```
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

```
git clone https://github.com/TU_USUARIO/tricentis-demowebshop-playwright.git
cd tricentis-demowebshop-playwright

```

*(Si descargaste el archivo `.zip`, descomprimilo, abrí la carpeta en VS Code y abrí una terminal integrada con `Ctrl + Ñ` o desde el menú `Terminal -> New Terminal`).*

### Paso 2: Instalar las dependencias de Node.js (`@playwright/test` y `typescript`)

```
npm install

```

### Paso 3: Instalar los binarios del navegador para Playwright

```
npx playwright install chrome

```

## 5. Ejecución de las Pruebas Automatizadas

Podés usar cualquiera de los comandos preconfigurados en `package.json`:

| Qué querés ejecutar | Comando a correr en la terminal | 
| ----- | ----- | 
| **Correr TODOS los tests** (los 6 casos + el test de falla forzada) | `npm test` | 
| **Correr solo los 6 casos funcionales exitosos** (Registro, Login y Carrito) | `npx playwright test tests/register.spec.ts tests/login.spec.ts tests/cart.spec.ts` | 
| **Correr los tests viendo el navegador Chrome abrirse en pantalla** (*Headed mode*) | `npm run test:headed` | 
| **Abrir la interfaz interactiva de Playwright (UI Mode)** | `npm run test:ui` | 
| **Correr únicamente las pruebas de Registro (`AUT-REG-01` y `02`)** | `npm run test:register` | 
| **Correr únicamente las pruebas de Login (`AUT-LOGIN-01` y `02`)** | `npm run test:login` | 
| **Correr únicamente las pruebas de Carrito (`AUT-CART-02` y `03`)** | `npm run test:cart` | 
| **Correr únicamente la prueba de Falla Forzada (`BUG-CART-01`)** | `npm run test:bug` | 
| **Verificar que no haya errores de tipos en TypeScript** | `npm run typecheck` | 

## 6. Validación de Screenshots al Fallar un Test y Reporte HTML

El framework está configurado en dos niveles para que nunca se pierda la evidencia visual cuando falla una prueba:

1. **En `playwright.config.ts`**: Se define `screenshot: 'only-on-failure'`, lo cual genera una captura automática en la carpeta `test-results/` y la incrusta en el reporte HTML.

2. **En `src/fixtures/baseTest.ts`**: Un hook `test.afterEach` detecta cualquier test cuyo estado sea distinto al esperado y guarda una captura de página completa directamente en `tests/screenshots/FAILED_<nombre_del_test>.png`, además de adjuntarla al reporte bajo el nombre **"Evidencia de Falla (Screenshot)"**.

### Cómo probarlo paso a paso:

1. Ejecutá el caso de prueba de falla forzada:

   ```
   npm run test:bug
   
   ```

2. Verás que el test `BUG-CART-01 (Falla Forzada)` falla porque la tienda no muestra el mensaje `"The maximum quantity allowed for purchase is 10000."`.

3. Revisá la carpeta `tests/screenshots/`: encontrarás la imagen `FAILED_bug-cart-01_falla_forzada_validar_mensaje_de_error_al_ingresar_9999999999_en_qty_del_carrito.png`.

4. Abrí el reporte HTML interactivo ejecutando:

   ```
   npm run report
   
   ```

   Al hacer clic sobre el test fallido en el navegador, verás los pasos ejecutados (`test.step`) y al final la **Screenshot adjunta** junto con el video y la traza (`trace`) de la ejecución.

## 7. Guía Paso a Paso para Subir este Proyecto a GitHub

Si tenés los archivos en tu computadora y querés publicarlos en un repositorio público de GitHub para entregarlos:

1. Ingresá a <https://github.com/new> con tu cuenta de GitHub.

2. En **Repository name**, escribí por ejemplo: `tricentis-demowebshop-playwright`.

3. Seleccioná **Public** (Público).

4. **No** marques *"Add a README file"* ni *"Add .gitignore"* (porque el proyecto ya los incluye listos). Hacé clic en **Create repository**.

5. Abrí una terminal dentro de la carpeta del proyecto y ejecutá estos comandos uno por uno:

   ```
   git init
   git add .
   git commit -m "feat: framework de automatizacion Playwright + TS y documentacion QA"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/tricentis-demowebshop-playwright.git
   git push -u origin main
   
   ```

   *(Reemplazá `TU_USUARIO` por tu nombre de usuario de GitHub).*