<template>
    <aside class="w-64 bg-blue-950 border-r p-4 min-h-screen flex flex-col justify-between">
    <div class="flex items-center space-x-1.5 mb-6 mt-6">
        <Car class="text-blue-950 rounded bg-gray-300 w-10 h-10 p-2"></Car>
        <div class="space-x-5">
            <div class="text-xl font-bold text-white leading-tight"> SmartFinance</div>
            <div class="text-gray-500 text-sm">Drive</div>
        </div>
    </div>
    <nav class="space-y-3">
        <a href="/search-vehicles" class="block p-2 rounded hover:bg-gray-300 hover:text-blue-950 text-sm font-medium text-gray-300"> 
            <div class="flex space-x-1.5">
                <Car></Car>
                <span>Buscar Vehiculos</span>
            </div>
        </a>
        <a href="/concessionaries" class="block p-2 rounded hover:bg-gray-300 hover:text-blue-950 text-sm font-medium text-gray-300">
            <div class="flex space-x-1.5">
                <Warehouse></Warehouse>
                <span>Buscar Concesionarias</span>
            </div>
        </a>
        <a href="/consultations" class="block p-2 rounded hover:bg-gray-300 hover:text-blue-950 text-sm font-medium text-gray-300"> 
            <div class="flex space-x-1.5">
                <Comment></Comment>
                <span>Consulta IA</span>
            </div>
        </a>
        <a href="/reports" class="block p-2 rounded hover:bg-gray-300 hover:text-blue-950 text-sm font-medium text-gray-300"> 
            <div class="flex space-x-1.5">
                <FileO></FileO>
                <span>Reporte</span>
            </div>
        </a>
        <a href="/users" class="block p-2 rounded hover:bg-gray-300 hover:text-blue-950 text-sm font-medium text-gray-300"> 
            <div class="flex space-x-1.5">
                <User></User>
                <span>Perfil</span>
            </div>
        </a>
        <a href="/configuration" class="block p-2 rounded hover:bg-gray-300 hover:text-blue-950 text-sm font-medium text-gray-300"> 
            <div class="flex space-x-1.5">
                <Cog></Cog>
                <span>Configuracion</span>
            </div>
        </a>
    </nav>
    <div class="mt-auto bg-sky-900/30 rounded p-3 flex items-center space-x-3 text-white">
        <div class="space-y-3">
            <p class="font-bold">¿Necesitas ayuda?</p>
            <p class="text-xs">Contacta a un asesor financiero certificado ahora</p>
            <a href="#" class="flex w-max p-2 rounded bg-emerald-500 "> Llamar Soporte</a>
        </div>
    </div>

</aside>
</template>

<script setup>
    import Car from '@primeicons/vue/car';
    import Warehouse from '@primeicons/vue/warehouse';
    import Comment from '@primeicons/vue/comment';
    import FileO from '@primeicons/vue/file-o';
    import User from '@primeicons/vue/user';
    import Cog from '@primeicons/vue/cog';
</script>