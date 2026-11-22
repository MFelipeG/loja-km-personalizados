import React from 'react';
import { Lock, Sparkles, Circle, Key, Camera, Clock } from 'lucide-react';

export default function UpcomingProducts({ products }) {
  const defaultProducts = [
    {
      id: 'botons-redondos',
      title: 'Bótons Redondos Clássicos',
      description: 'O clássico bóton americano redondo (3,8 cm e 5,5 cm) com alfinete de segurança em metal.',
      badge: 'Em Testes no Ateliê',
      icon: Circle
    },
    {
      id: 'chaveiros-acrilico',
      title: 'Chaveiros Acrílicos Foto',
      description: 'Chaveiro transparente resistente com sua foto frente e verso para levar onde for.',
      badge: 'Lançamento Próximo',
      icon: Key
    },
    {
      id: 'imas-polaroid',
      title: 'Ímãs Estilo Polaroid',
      description: 'Ímãs retangulares no estilo retrô clássico com legenda e data do momento especial.',
      badge: 'Em Breve',
      icon: Camera
    }
  ];

  const items = products && products.length > 0 ? products : defaultProducts;

  return (
    <section id="em-breve" className="py-16 md:py-20 bg-atelier-50/70 border-b border-atelier-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-200 text-atelier-700 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-brand" />
            <span>Futuros Lançamentos</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-brand-dark">
            Em Breve na KM Personalizados
          </h2>
          <p className="text-atelier-600 text-xs sm:text-sm">
            Estamos preparando novos produtos personalizados para completar a sua coleção com a mesma qualidade premium.
          </p>
        </div>

        {/* 3 Styled Preview Cards with Blur/Lock styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((prod, idx) => {
            const IconComponent = prod.icon === 'Circle' ? Circle : prod.icon === 'Key' ? Key : Camera;

            return (
              <div
                key={prod.id || idx}
                className="relative rounded-3xl p-6 bg-white/70 border border-atelier-200/80 overflow-hidden shadow-xs group hover:border-atelier-300 transition-all select-none"
              >
                {/* Background decorative watermark */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 text-atelier-200/30 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-full h-full stroke-[1.2]" />
                </div>

                {/* Top Badge & Lock */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-brand-leather bg-brand-cream/80 border border-brand-light/30 px-2.5 py-1 rounded-full">
                    {prod.badge || 'Em Breve'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-atelier-100 flex items-center justify-center text-atelier-500">
                    <Lock className="w-4 h-4 text-brand-leather" />
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <h3 className="font-serif text-lg font-bold text-brand-dark">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-atelier-600 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                {/* Lock overlay banner */}
                <div className="mt-6 pt-4 border-t border-atelier-100 flex items-center gap-2 text-[11px] font-medium text-atelier-500">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cadastrando fornecedores de matéria-prima</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
