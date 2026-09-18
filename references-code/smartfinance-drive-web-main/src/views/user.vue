<template>
    <div class=" ms-6 space-y-3">
        <div class="space-y-3">
            <p class="text-4xl font-semibold text-blue-950">
                Mi Perfil
            </p>
            <p class="text-gray-600">
                Actualiza tu información personal y perfil crediticio para mejorar tus pre-evaluaciones financieras.
            </p>
        </div>
        <div class="grid grid-cols-2 gap-x-12 w-full">
            <div class="space-y-3 border-2 border-gray-400/50 rounded-2xl p-4">
                <div class="border-b-2 pb-4 border-gray-400/50 space-y-1">
                    <p class="text-blue-950 text-xl">
                        Información Personal
                    </p>
                    <p class="text-gray-500 text-sm">
                        Datos básicos de contacto e identificación.
                    </p>
                </div>
                <div class="text-blue-950 font-semibold space-y-2">
                    <p>
                        Nombre completo
                    </p>
                    <input
                        value="Carlos Mendoza"
                        class="w-full px-4 py-2.5 text-sm 
                        text-black font-medium
                        bg-gray-400/50 border 
                        border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-2 
                        focus:ring-blue-950 focus:border-blue-950 
                        transition-all shadow-sm"
                        />
                    <p>
                        Correo Electronico
                    </p>
                    <input
                        value="carlos.mendoza@gmail.com"
                        class="w-full px-4 py-2.5 text-sm 
                        text-black font-medium
                        bg-gray-400/50 border 
                        border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-2 
                        focus:ring-blue-950 focus:border-blue-950 
                        transition-all shadow-sm"/>
                    <p>
                        Teléfono de contacto
                    </p>
                    <input
                        value="+51 12345678"
                        class="w-full px-4 py-2.5 text-sm 
                        text-black font-medium
                        bg-gray-400/50 border 
                        border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-2 
                        focus:ring-blue-950 focus:border-blue-950 
                        transition-all shadow-sm"/>
                </div>
            </div>
            <div class="space-y-3 border-2 border-gray-400/50 rounded-2xl p-4">
                <div class="border-b-2 pb-4 border-gray-400/50 space-y-1">
                    <p class="text-blue-950 text-xl">
                        Perfil Financiero
                    </p>
                    <p class="text-gray-500 text-sm">
                        Declaración de solvencia para cálculo de tasas.
                    </p>
                </div>
                <div class="text-blue-950 font-semibold space-y-2">
                    <p>
                        Ingreso mensual estimado (USD)
                    </p>
                    <input
                        value="$ 3,500 USD"
                        class="w-full px-4 py-2.5 text-sm 
                        text-black font-medium
                        bg-gray-400/50 border 
                        border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-2 
                        focus:ring-blue-950 focus:border-blue-950 
                        transition-all shadow-sm"
                        />
                    <p>
                        Situación laboral
                    </p>
                    <input
                        value="Empleado de tiempo completo (indefinido)"
                        class="w-full px-4 py-2.5 text-sm 
                        text-black font-medium
                        bg-gray-400/50 border 
                        border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-2 
                        focus:ring-blue-950 focus:border-blue-950 
                        transition-all shadow-sm"/>
                    <p>
                        Antigüedad laboral
                    </p>
                    <input
                        value="3 años"
                        class="w-full px-4 py-2.5 text-sm 
                        text-black font-medium
                        bg-gray-400/50 border 
                        border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-2 
                        focus:ring-blue-950 focus:border-blue-950 
                        transition-all shadow-sm"/>
                
                </div>
            </div>
        </div>  
        <div class="flex justify-start w-full">
            <button 
                type="submit"
                class="mr-auto inline-flex items-center justify-center 
                w-max px-6 py-2.5 rounded-xl bg-orange-400/70 hover:bg-orange-500/70 text-white font-semibold text-sm transition-colors shadow-sm">
                Actualizar contraseña
            </button>
        </div>
    </div>
</template>