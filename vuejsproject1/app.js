const { createApp } = Vue;

createApp({
    data() {
        return {
            pieces: [],
            searchQuery: '',
            selectedCategory: '',
            showOnlyAvailable: false,
            panier: [],
            afficherPanier: false, // Affichage du panier
            message: '' // Message temporaire pour l'ajout au panier
        };
    },
    computed: {
        categories() {
            return [...new Set(this.pieces.map(p => p.categorie))];
        },
        filteredPieces() {
            return this.pieces.filter(piece => {
                return (
                    piece.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
                    (this.selectedCategory === '' || piece.categorie === this.selectedCategory) &&
                    (!this.showOnlyAvailable || piece.disponible)
                );
            });
        }
    },
    methods: {
        async fetchPieces() {
            const response = await fetch('pieces-auto.json');
            this.pieces = await response.json();
            this.pieces.forEach(piece => {
                piece.disponible = Math.random() < 0.8; // Simule la disponibilité
            });
        },
        ajouterAuPanier(piece) {
            if (!piece) return; // Vérification pour éviter les erreurs
        
            this.panier.push({
                id: piece.id,
                nom: piece.nom,
                prix: piece.prix
            });
        
            this.message = `"${piece.nom}" a été ajouté au panier !`;
        
            setTimeout(() => {
                this.message = ''; // Efface le message après 2 secondes
            }, 2000);
        }
        ,
        togglePanier() {
            this.afficherPanier = !this.afficherPanier;
        },
        sortByPriceAsc() {
            this.pieces.sort((a, b) => a.prix - b.prix);
        },
        sortByPriceDesc() {
            this.pieces.sort((a, b) => b.prix - a.prix);
        }
    },
    mounted() {
        this.fetchPieces();
    }
}).mount('#app');
