<script setup>
import TicketBar from './components/TicketBar.vue'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import MirrorSection from './components/MirrorSection.vue'
import GuitarStage from './components/GuitarStage.vue'
import DvdSection from './components/DvdSection.vue'
import ShowsSection from './components/ShowsSection.vue'
import AboutSection from './components/AboutSection.vue'
import EffortSection from './components/EffortSection.vue'
import FormatsSection from './components/FormatsSection.vue'
import ProofSection from './components/ProofSection.vue'
import RiskSection from './components/RiskSection.vue'
import AgendaSection from './components/AgendaSection.vue'
import FaqSection from './components/FaqSection.vue'
import InstagramSection from './components/InstagramSection.vue'
import ClosingSection from './components/ClosingSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import WhatsFloat from './components/WhatsFloat.vue'
</script>

<template>
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <TicketBar />
  <SiteHeader />
  <main id="conteudo">
    <HeroSection />
    <GuitarStage />
    <DvdSection />
    <ShowsSection />
    <MirrorSection />
    <AboutSection />
    <EffortSection />
    <FormatsSection />
    <ProofSection />
    <RiskSection />
    <AgendaSection />
    <FaqSection />
    <InstagramSection />
    <ClosingSection />
  </main>
  <SiteFooter />
  <WhatsFloat />
</template>
