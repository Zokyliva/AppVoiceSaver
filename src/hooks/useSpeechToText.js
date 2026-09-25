import { useCallback, useRef, useState } from "react";

// --- Strategy Pattern ---
// Deux "stratégies" de transcription, interchangeables, qui respectent la
// même interface : { start(onResult), stop() }.
// Le hook ne dépend jamais d'une implémentation concrète, seulement de
// cette interface (DIP). Pour ajouter un jour une stratégie "Whisper API",
// il suffit d'écrire un objet de plus avec la même forme, SANS toucher au
// reste du code (OCP : ouvert à l'extension, fermé à la modification).

function createWebSpeechStrategy() {
  const SpeechRecognitionImpl =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition = null;
  let latestTranscript = "";

  return {
    isSupported: Boolean(SpeechRecognitionImpl),
    start(onResult, onError) {
      recognition = new SpeechRecognitionImpl();
      recognition.lang = "fr-FR";
      recognition.continuous = true;
      recognition.interimResults = true;
      latestTranscript = "";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        latestTranscript = transcript;
        onResult(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Erreur SpeechRecognition :", event.error);
        onError?.(event.error);
      };

      recognition.start();
    },
    // stop() retourne une Promise qui se résout seulement une fois que
    // l'événement `onend` du navigateur est bien arrivé — donc une fois
    // que `latestTranscript` contient vraiment le dernier résultat.
    // Sans ça, un appelant qui lit le transcript juste après stop()
    // pouvait lire une valeur pas encore à jour (event asynchrone du
    // navigateur vs lecture synchrone du code appelant).
    // stop() retourne une Promise qui se résout soit quand `onend` arrive,
    // soit après un délai de sécurité (Chrome Android ne déclenche pas
    // toujours `onend` de façon fiable — sans ce filet, l'app restait
    // bloquée indéfiniment sur "Enregistrement en cours...").
    stop() {
      return new Promise((resolve) => {
        if (!recognition) return resolve(latestTranscript);

        let resolved = false;
        const finish = () => {
          if (resolved) return;
          resolved = true;
          resolve(latestTranscript);
        };

        recognition.onend = finish;
        recognition.stop();

        // Filet de sécurité : si onend n'arrive jamais, on continue quand
        // même après 3 secondes avec le dernier texte capté.
        setTimeout(() => {
          if (!resolved) {
            recognition.abort?.();
            finish();
          }
        }, 3000);
      });
    },
  };
}

function createUnsupportedStrategy() {
  return {
    isSupported: false,
    start(onResult, onError) {
      onError?.("not-supported");
    },
    stop() {
      return Promise.resolve("");
    },
  };
}

function pickStrategy() {
  const webSpeech = createWebSpeechStrategy();
  return webSpeech.isSupported ? webSpeech : createUnsupportedStrategy();
}

export function useSpeechToText() {
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const strategyRef = useRef(pickStrategy());

  const start = useCallback(() => {
    setTranscript("");
    setError(null);
    strategyRef.current.start(
      (text) => setTranscript(text),
      (err) => setError(err)
    );
  }, []);

  // stop() est maintenant async : il renvoie directement le texte final,
  // fiable, sans dépendre du timing de mise à jour du state React.
  const stop = useCallback(async () => {
    const finalText = await strategyRef.current.stop();
    setTranscript(finalText);
    return finalText;
  }, []);

  return {
    transcript,
    error,
    isSupported: strategyRef.current.isSupported,
    start,
    stop,
  };
}
