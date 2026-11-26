import React, { useState, useEffect } from 'react';
import { Star, Heart, Camera, CheckCircle2, MessageSquare, Plus, Upload, X } from 'lucide-react';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  // Fetch approved public reviews
  const loadReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.warn('Erro ao carregar avaliações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handlePhotoSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('Preencha seu nome e seu depoimento.');
      return;
    }

    setSubmitting(true);
    setSubmittedMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('rating', rating);
      formData.append('comment', comment.trim());
      if (photo) {
        formData.append('photo', photo);
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedMessage(data.message || 'Avaliação enviada com sucesso! Ela entrará no ar após moderação.');
        setName('');
        setRating(5);
        setComment('');
        setPhoto(null);
        setPhotoPreview(null);
      } else {
        alert('Erro ao enviar avaliação. Tente novamente.');
      }
    } catch (err) {
      alert('Erro de conexão ao enviar avaliação.');
    } finally {
      setSubmitting(false);
    }
  };

  // Average score
  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section id="depoimentos" className="py-16 md:py-24 bg-atelier-100/50 border-b border-atelier-200/80 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
              <span>Prova Social Real</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
              Quem Já Recebeu e Amou
            </h2>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-bold text-sm text-brand-dark">
                {avgRating} de 5.0
              </span>
              <span className="text-xs text-atelier-500">
                ({reviews.length} avaliações de clientes reais)
              </span>
            </div>
          </div>

          {/* Leave Review Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-atelier-50 text-brand-dark font-bold text-xs sm:text-sm border border-atelier-300 shadow-xs flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4 text-brand" />
            <span>Avaliar Meus Bótons</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-atelier-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-brand/30 transition-all"
            >
              <div className="space-y-3">
                {/* Stars and date */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-atelier-400">
                    {new Date(rev.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* Comment text */}
                <p className="text-xs sm:text-sm text-atelier-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Customer Real Photo if available */}
                {rev.photoUrl && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden border border-atelier-100 bg-atelier-50">
                    <img
                      src={rev.photoUrl}
                      alt={`Foto enviada por ${rev.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Author */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-atelier-100">
                <div className="w-8 h-8 rounded-full bg-brand-cream border border-brand-light/30 flex items-center justify-center font-bold text-xs text-brand">
                  {rev.name ? rev.name[0].toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-brand-dark">
                    {rev.name}
                  </h4>
                  {rev.origin === 'google' || (rev.badge && rev.badge.toLowerCase().includes('google')) ? (
                    <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1.5 bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-100/80">
                      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Avaliação no Google</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{rev.badge || 'Compra Verificada'}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Leave a Review */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-atelier-200 overflow-hidden">
              
              <div className="px-6 py-4 bg-atelier-50 border-b border-atelier-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand" />
                  <h3 className="font-serif font-bold text-lg text-brand-dark">
                    Avaliar Meus Bótons
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmittedMessage('');
                  }}
                  className="p-2 text-atelier-400 hover:text-atelier-700 hover:bg-atelier-200/60 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {submittedMessage ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-brand-dark">
                      Obrigado pelo seu carinho!
                    </h4>
                    <p className="text-xs text-atelier-600 max-w-xs mx-auto">
                      {submittedMessage}
                    </p>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setSubmittedMessage('');
                      }}
                      className="px-6 py-2.5 bg-brand text-atelier-50 font-bold text-xs rounded-xl"
                    >
                      Concluir
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-atelier-700 mb-1">
                        Seu Nome *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Beatriz Lima"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-atelier-700 mb-1">
                        Sua Nota (1 a 5 estrelas)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 text-amber-500 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${star <= rating ? 'fill-current' : 'text-atelier-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-atelier-700 mb-1">
                        Seu Comentário *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Conte como ficaram seus ímãs na geladeira, a nitidez das cores..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-atelier-300 focus:outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-atelier-700 mb-1">
                        Foto Real dos Seus Ímãs (Opcional)
                      </label>
                      <label className="border border-dashed border-atelier-300 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-atelier-50 text-xs text-atelier-600">
                        <Camera className="w-4 h-4 text-brand" />
                        <span>{photo ? photo.name : 'Clique para selecionar uma foto'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePhotoSelect}
                          className="hidden"
                        />
                      </label>
                      {photoPreview && (
                        <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-atelier-200">
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-brand hover:bg-brand-dark disabled:bg-atelier-300 text-atelier-50 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      {submitting ? 'Enviando...' : 'Enviar Minha Avaliação'}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
