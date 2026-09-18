<template>
    <div class=" ms-6 space-y-9">
        <div class="space-y-3">
            <p class="text-4xl font-semibold text-blue-950">
                Configuración
            </p>
            <p class="text-gray-600">
                Administra tus preferencias, medidas de seguridad y ajustes general del sistema.
            </p>
        </div>
        <div class="space-y-6 border-2 border-gray-400/50 rounded-2xl p-4">
            <div class="flex items-center justify-between w-full pb-4">
                <div class="flex flex-col pr-4">
                    <p class="text-blue-950 font-semibold">
                        Notificaciones
                    </p>
                    <p class="text-gray-600 text-sm">
                        Configura cómo y cuándo deseas recibir alertas sobre tus ofertas de crédito.
                    </p>
                </div>
            </div>
            <div class="flex items-center justify-between w-full pb-4">
                <div class="flex flex-col pr-4">
                    <p class="text-blue-950 font-semibold">
                        Alertas de actualización de solicitudes
                    </p>
                    <p class="text-gray-600 text-sm">
                        Notificarme inmediatamente cuando una concesionaria actualice mi estado de crédito.
                    </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-400 rounded-full 
                        peer-checked:bg-emerald-500 
                        after:content-[''] 
                        after:absolute 
                        after:top-0.5 
                        after:inset-s-0.5 
                        after:bg-white 
                        after:rounded-full 
                        after:h-5 
                        after:w-5 
                        after:transition-all 
                        peer-checked:after:translate-x-full">
                    </div>
                </label>
            </div>
            <div class="flex items-center justify-between w-full pb-4">
                <div class="flex flex-col pr-4">
                    <p class="text-blue-950 font-semibold">
                        Resumen semanal de vehículos recomendados
                    </p>
                    <p class="text-gray-600 text-sm">
                        Enviar un correo semanal con mejores precios ajustados a mi perfil crediticio.
                    </p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-400 rounded-full 
                        peer-checked:bg-emerald-500 
                        after:content-[''] 
                        after:absolute 
                        after:top-0.5 
                        after:inset-s-0.5 
                        after:bg-white 
                        after:rounded-full 
                        after:h-5 
                        after:w-5 
                        after:transition-all 
                        peer-checked:after:translate-x-full">
                    </div>
                </label>
            </div>
        </div>
        <div class="space-y-3 border-2 border-gray-400/50 rounded-2xl p-4">
            <div>
            <p class="font-semibold text-blue-950">
                Seguridad de la Cuenta
            </p>
            <p class="text-gray-600">
                Protege tu información financiera con una contraseña robusta.
            </p>
            </div>
            <div class="grid grid-cols-2 gap-x-12 w-full">
                <div class="flex flex-col space-y-2 text-sm font-semibold text-blue-950">
                    <label> Contraseña actual </label>
                    <input 
                        type="password" 
                        value="12345678"
                        class="w-full px-4 py-2.5 text-sm 
                        text-gray-900 
                        bg-gray-400/50 border 
                        border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-2 
                        focus:ring-blue-950 focus:border-blue-950 
                        transition-all shadow-sm"/>
                </div>
                <div class="flex flex-col space-y-2 text-sm font-semibold text-blue-950">
                    <label>Nueva contraseña</label>
                                    <input 
                        type="password" 
                        value="12345678"
                        class="w-full px-4 py-2.5 text-sm 
                        text-gray-900 
                        bg-gray-400/50 border 
                        border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-2 
                        focus:ring-blue-950 focus:border-blue-950 
                        transition-all shadow-sm"/>
                </div>
            </div>
            <button 
                type="submit"
                class="inline-flex items-center justify-center 
                w-max px-6 py-2.5 rounded-xl bg-orange-400/70 hover:bg-orange-500/70 text-white font-semibold text-sm transition-colors shadow-sm">
                Actualizar contraseña
            </button>
        </div>
        <div class="space-y-3 border-2 border-gray-400/50 rounded-2xl p-4">
            <div class="flex flex-col pr-4">
                <p class="text-red-600 font-semibold">
                    Zona de Peligro
                </p>
                <p class="text-gray-600 text-sm">
                    Acciones irreversibles relacionadas con tu cuenta de SmartFinance.
                </p>
            </div>
            <div class="flex flex-col pr-4">
                <p class="text-blue-950 font-semibold">
                    Eliminar mi cuenta
                </p>
                <p class="text-gray-600 text-sm">
                    Eliminaras permanentemente todas tus búsquedas guardadas, perfiles de crédito, y solicitudes activadas.
                </p>
            </div>
        </div>
    </div>
</template>