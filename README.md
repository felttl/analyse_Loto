<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>


# Series de Fourier

###### fichier markdown avec Latex/Texit dedans auto-interprété
1) [url : plugin d'interpretation (VSC, visual studio code):](https://github.com/mjbvz/vscode-github-markdown-preview-style)
2) [lien d'editeur de Latex/Texit sur Markdown](https://github.com/yzhang-gh/vscode-markdown)
<br>

<hr>

## Théorème de Dirichlet

$$a_0 + \sum ^{+\infty}_{p=1} (a_n * cos(n*\omega * t)+b_n sin(n * \omega * t))$$

## Théorème de Parceval

$$
{\displaystyle E=\int _{-\infty }^{+\infty }|x(t)|^{2}~\mathrm {d} t=\int _{-\infty }^{+\infty }|X(f)|^{2}~\mathrm {d} f.} \\ 

\color{#ff5555}{\boxed{
  règle\space importante : \\
  \sum ^{+\infty}_{n=1}\frac{1}{n²}=\frac{\pi²}{6} 
}}



$$
### connu + formules de base

$$
a_0 = 0  \\
a_n = 0  \\

$$

### etape 1 :

$$
0 + \sum ^{+\infty}_{n=1} (0*cos(n*\frac{\pi}{2})+b_{n}sin(n*\frac{\pi}{2}))

$$

### etape 2 :

$$
\frac{\pi}{2} = \sum ^{+\infty}_{p=1} b_{2 \times p} +
\underset{=0}{\undergroup{sin(\cancel{\text{2}} \times p \frac{\pi}{\cancel{\text{2}}} )}} + \sum ^{+\infty}_{p=0} b_{2\times p+1} \times sin((2 \times p + 1)\times \frac{\pi}{2})

$$

### etape 3

bloqué ! comment on fait pour passer de l'etape 2 a 3 ?

# statistiques BI1 jusq'a BA2

### Test de χ² (khi-deux)

échantillon de données de : 
${ y_1,y_2,...,y_J }$ 
d'une variable aléatoire Y 
on a aussi :
$$
{ \sum _{j=1}^{J}p_{j}=1} \\ 
\sum _{j=1}^{J}p_{j} = p_1+p_2+p_3+...+p_J
$$
donc par formule générale on obtient :
$$
{ T=\sum _{j=1}^{J}{\frac {(N{\^{p}_j}-Np_{j})^{2}}{Np_{j}}}=\sum _{j=1}^{J}{\frac {(n_{j}-Np_{j})^{2}}{Np_{j}}}\ } \\ 
où\ n_j = N\^{p_j} = \sum ^{N}_{i=1}1_{y_{i}=v_j}  
 
$$


<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
blocs à réutiliser

- sous groupe (acolade horizontale)<br>

$$
\underbrace{\text{formule}}_{\cancel{\text{text barré}}} % sub snippets quot

$$

<!-- template sous parenthésé : 
\documentclass{article}
\usepackage{amsmath}
\begin{document}
\[
\underbrace{\text{Votre contenu ici}}_{\text{Explication ici}}
\]
\end{document} -->

<!-- end page -->
