En av produktägarna för PTZ har precis varit på en stor säkerhetsmässa och fått feedback från kunder att det hade varit trevligt om det fanns nått litet spel som operatörerna skulle kunna spela när det inte händer så mycket i kontrollrummet. Det beslutas att ett quiz hade kunnat passa.

Du har fått i uppgift att göra en demo av hur detta skulle kunna implementeras. Det finns ingen färdig backend men efter ett extrainkallat möte har parameter-gruppen lyckats komma överens om hur listan på frågor ska se ut.

Exempelsvar från /questions

```
root.Quiz.Cat=Science Computers
root.Quiz.Q1.Question=Which company was established on April 1st, 1976 by Steve Jobs, Steve Wozniak and Ronald Wayne?
root.Quiz.Q1.Answer=Apple
root.Quiz.Q1.Incorrects=Microsoft,Atari,Commodore
root.Quiz.Q2.Question=Which computer hardware device provides an interface for all other connected devices to communicate?
root.Quiz.Q2.Answer=Motherboard
root.Quiz.Q2.Incorrects=Central Processing Unit,Hard Disk Drive,Random Access Memory
```

Tre frågor ska ställas i randomiserad ordning efter varandra en åt gången. Svaren ska sedan rättas med en get-request enligt formatet: `/score?Quiz.Q1.Guess=Apple&Quiz.Q2.Guess=Central Processing Unit`. I text-svaret får man tillbaka hur många rätt operatören hade. Antalet rätt presenteras för operatören varefter hen kan välja att spela en gång till.

Uppgiften ska skrivas med Typescript, ramverk är valfritt, designen är oviktig än så länge. I detta repo finns en mock-server som svarar på endpoints "/questions" och "/score".
