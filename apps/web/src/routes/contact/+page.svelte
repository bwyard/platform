<script lang="ts">
  import type { PageData } from './$types';

  const { data: _data }: { data: PageData } = $props();
</script>

<section class="mx-auto max-w-5xl px-6 py-20">
  <h1 class="text-4xl font-bold tracking-tight text-gray-900">Contact</h1>
  <p class="mt-4 max-w-xl text-lg text-gray-600">
    Most engagements start with a short conversation. Reach out and let's figure out if there's a
    fit.
  </p>
</section>

<section class="border-t border-gray-100">
  <div class="mx-auto max-w-5xl px-6 py-16">
    <div class="max-w-md">
      <h2 class="text-xl font-semibold text-gray-900">Get in touch</h2>

      <dl class="mt-8 space-y-6">
        <div>
          <dt class="text-sm font-medium text-gray-500">Email</dt>
          <dd class="mt-1">
            <a
              href="mailto:hello@8ofwands.com"
              class="text-gray-900 underline underline-offset-4 hover:text-gray-600"
            >
              hello@8ofwands.com
            </a>
          </dd>
        </div>
      </dl>

      <div class="mt-12 border-t border-gray-100 pt-10">
        <h3 class="text-base font-semibold text-gray-900">Book a call</h3>
        <p class="mt-2 text-sm text-gray-600">
          Prefer to jump straight in? Email me with a few sentences about what you're working on and
          what kind of help you're looking for. I'll reply with availability.
        </p>
      </div>
    </div>
  </div>
</section>
