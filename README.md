# ArriendosYa

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## CU-04 — Asignar arrendatario a propiedad (Modo Demo)

### ¿Qué parte es real y qué parte es simulada?

| Funcionalidad | Estado |
|---|---|
| Listar propiedades disponibles | **Real** (datos mock en frontend, API: `GET /api/propiedades`) |
| Listar arrendatarios | **Real** (datos mock en frontend, API: `GET /api/arrendatarios`) |
| Confirmar asignación propiedad-arrendatario | **Real** — llama a `PUT /api/propiedades/{id}/asignar-arrendatario/{rut}` |
| Términos contractuales (monto, garantía, fechas, reajuste, día de pago) | **Simulado (demo)** — persisten en `localStorage` del navegador |

Los términos contractuales se almacenan localmente porque el backend aún no expone endpoints para persistir contratos. La UI indica claramente el modo simulado con una etiqueta visible **"⚠ Modo demo — términos contractuales simulados"**.

### Cómo probar CU-04

1. Inicia el servidor de desarrollo con `ng serve`.
2. Navega a la sección **Gestión de contratos → Asignar arrendatario a propiedad**.
3. Selecciona una **propiedad** de la lista.
4. Busca y selecciona un **arrendatario**.
5. Completa las **condiciones económicas** (renta, garantía, fechas, día de pago, reajuste).
6. Haz clic en **"Confirmar asignación"**.
   - La aplicación llama a `PUT /api/propiedades/{id}/asignar-arrendatario/{rut}` contra el backend real.
   - Si la llamada tiene éxito, guarda los términos contractuales en `localStorage`.
   - Se muestra un mensaje de éxito indicando que es una confirmación en modo demo.
7. Recarga la página y selecciona la misma propiedad: el resumen del contrato guardado se muestra automáticamente.

### Cómo limpiar los datos demo

**Opción 1 — Desde la UI:**
Haz clic en el botón **"🔄 Reiniciar demo"** en la pantalla de asignación. Esto elimina todos los contratos simulados del `localStorage` y reinicia el formulario.

**Opción 2 — Desde la consola del navegador:**
```javascript
localStorage.removeItem('arriendosya_demo_contracts');
```

**Opción 3 — Desde DevTools:**
Abre DevTools → Application → Local Storage → elimina la clave `arriendosya_demo_contracts`.

### Servicio de persistencia simulada

El servicio `SimulatedContractService` (`src/app/dashboard/services/simulated-contract.service.ts`) gestiona la persistencia local:

- `saveContract(data)` — guarda o sobreescribe el contrato de una propiedad.
- `getByPropertyId(id)` — recupera el contrato de una propiedad.
- `getAll()` — retorna todos los contratos guardados.
- `removeByPropertyId(id)` — elimina el contrato de una propiedad.
- `clearAll()` — elimina todos los contratos (reinicio demo).

