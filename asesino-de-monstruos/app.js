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
        atacar: function (rangoRec) {
            let damage = this.calcularHeridas(rangoRec);
            this.saludMonstruo -= damage;
            this.registrarEvento({
                esJugador: true,
                text: `Jugador atacó por ${damage}% de vida`
            });
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
                console.log("Hay ganador wey!");
                this.terminarPartida();
            }
        },

        ataqueLeve: function() {
            this.atacar(this.rangoAtaque);
        },

        ataqueEspecial: function () {
            this.atacar(this.rangoAtaqueEspecial);
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

            if (this.saludJugador >= 1 && this.saludMonstruo <= 0) {
                this.registrarEvento({
                    esJugador: true,
                    text: "Jugador le ganó al monstruo"
                });
            } 
            else {
                this.registrarEvento({
                    esJugador: false,
                    text: "Monstruo le ganó al jugador"
                });
            }
        },

        ataqueDelMonstruo: function () {
            let damage = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador -= damage;
            this.registrarEvento({
                esJugador: false,
                text: `Monstruo atacó por ${damage}% de vida`
            });
        },

        calcularHeridas: function (rango) {
            
            return Math.round(Math.random() * (rango[1] - rango[0]) + rango[0]);
        },
        verificarGanador: function () {
            console.log(this.saludJugador <= 0 || this.saludMonstruo <= 0)
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