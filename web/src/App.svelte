<script>
    import routes from './routes';
    import Router from 'svelte-spa-router';
    import { loc } from 'svelte-spa-router';

    console.log($loc);
</script>

<style>
    main {
        background-image: url('/assets/background.jpg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .bg-cover {
        background-color: rgba(0, 0, 0, .7);
    }
</style>

<main>
    <h1 class="text-white">{Router.location}</h1>
    <div class="h-screen bg-cover max-h-screen overflow-hidden">
        <div class="overflow-y-auto max-h-screen">
            <div class="flex min-h-screen my-10 md:my-0 items-center justify-center">
                <div class="man-w-sm w-4/5 md:w-1/2 lg:w-2/5 rounded shadow-lg bg-gray-900">
                    <div class="m-10">
                        <Router {routes} />
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
