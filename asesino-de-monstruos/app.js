new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        contadorTransicion: 0,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoCura: [1, 20],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
            this.turnos = [];

        },
        realizarTurno: function(actionPlayer) {

            // Always player first
            actionPlayer();
            // After the damage, we check if the monster is alive
            let winner = this.verificarGanador();
            if (!winner) {
                this.ataqueDelMonstruo();
            }
            // We need to check again if the player is dead :c
            winner = this.verificarGanador();

            if(winner) {
                this.terminarPartida();
            }
        },
        atacar: function (rangoRec) {
            let damage = this.calcularHeridas(rangoRec);
            this.saludMonstruo -= damage;
            this.registrarEvento({
                esJugador: true,
                text: `Jugador atacó por ${damage}% de vida`
            });
        },
        ataqueLeve: function() {
            this.atacar(this.rangoAtaque);
        },

        ataqueEspecial: function () {
            this.atacar(this.rangoAtaqueEspecial);
        },

        ataqueDelMonstruo: function () {
            let damage = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador -= damage;
            this.registrarEvento({
                esJugador: false,
                text: `Monstruo atacó por ${damage}% de vida`
            });
        },
        curar: function () {
            let heal = this.calcularHeridas(this.rangoCura);

            if (this.saludJugador + heal > 100) {
                // This line is to prevent healing up to 100.
                heal = 100 - this.saludJugador;
            }

            this.saludJugador += heal;
            this.registrarEvento({
                esJugador: true,
                text: `Jugador se curó por ${heal}% de vida`
            });
        },

        registrarEvento(evento) {
            evento.indice = this.contadorTransicion++;
            this.turnos.unshift(evento);
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
            let player = false;
            let texto = "Monstruo le ganó al jugador";

            if (this.saludJugador >= 1 && this.saludMonstruo <= 0) {
                texto = "Jugador le ganó al monstruo"
                player = true;
            } 

            this.registrarEvento({
                esJugador: player,
                text: texto
            });

        },



        calcularHeridas: function (rango) {
            
            return Math.round(Math.random() * (rango[1] - rango[0]) + rango[0]);
        },
        verificarGanador: function () {
            return this.saludJugador <= 0 || this.saludMonstruo <= 0;
        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});