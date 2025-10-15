' Modern Product Specification & Marketing PowerPoint Generator
' Usage:
' 1) Open PowerPoint, press Alt+F11
' 2) Insert -> Module, paste this code
' 3) Update the variables in the "CUSTOMIZE" section
' 4) Run CreateProductSpecDeck

Option Explicit
' PowerPoint constants (for environments without references)
Const msoTrue As Long = -1
Const msoFalse As Long = 0
Const msoShapeRoundedRectangle As Long = 5
Const msoShapeOval As Long = 9
Const msoAnchorMiddle As Long = 3
Const msoAnchorTop As Long = 1

Const ppLayoutBlank As Long = 12
Const ppLayoutText As Long = 2
Const ppEffectFade As Long = 1017
Const ppEffectPush As Long = 3017
Const ppEffectFadeSmoothly As Long = 3914
Const ppEffectDissolve As Long = 3073
Const ppThemeColorAccent1 As Long = 5
Const ppThemeColorAccent2 As Long = 6
Const ppThemeColorAccent3 As Long = 7
Const ppThemeColorBackground1 As Long = 1
Const ppThemeColorText1 As Long = 2

Sub CreateProductSpecDeck()
    On Error GoTo ErrHandler

    ' ---------- CUSTOMIZE ----------
    Dim productName As String: productName = "Product X"
    Dim productTagline As String: productTagline = "Reimagine how teams work"
    Dim logoPath As String: logoPath = "C:\Temp\logo.png"           ' leave blank if none
    Dim heroImagePath As String: heroImagePath = "C:\Temp\hero.jpg" ' leave blank if none
    Dim mockupImagePath As String: mockupImagePath = "C:\Temp\mockup.jpg"
    Dim coreColor1 As Long: coreColor1 = RGB(10, 25, 77)   ' dark navy
    Dim coreColor2 As Long: coreColor2 = RGB(0, 150, 136)  ' accent teal
    Dim coreColor3 As Long: coreColor3 = RGB(255, 183, 77) ' warm accent
    Dim neutralLight As Long: neutralLight = RGB(250, 250, 250)
    Dim neutralDark As Long: neutralDark = RGB(34, 34, 34)
    Dim headingFontName As String: headingFontName = "Segoe UI"
    Dim bodyFontName As String: bodyFontName = "Segoe UI"
    Dim numFeatureSlides As Integer: numFeatureSlides = 4
    ' --------------------------------

    Dim pres As Object
    Dim sld As Object
    Dim shp As Object
    Dim seq As Object
    Dim eff As Object
    Dim leftMargin As Single, topMargin As Single, slideW As Single, slideH As Single
    Dim i As Integer, featTop As Single

    ' Create new presentation
    Set pres = Presentations.Add(msoTrue)
    slideW = pres.PageSetup.SlideWidth
    slideH = pres.PageSetup.SlideHeight
    leftMargin = 48
    topMargin = 36

    ' Global: apply background & placeholder master styles
    Call ApplyGlobalStyles(pres, coreColor1, coreColor2, coreColor3, neutralLight, neutralDark, headingFontName, bodyFontName)

    ' --- Cover Slide ---
    Set sld = pres.Slides.Add(1, ppLayoutBlank)
    With sld
        .FollowMasterBackground = msoFalse
        With .Background.Fill
            .Visible = msoTrue
            .ForeColor.RGB = coreColor1
            .TwoColorGradient msoGradientDiagonalUp, 1
            .GradientStops(1).Color.RGB = coreColor1
            .GradientStops(2).Color.RGB = coreColor2
        End With
    End With

    ' Logo (optional)
    If Len(Trim(logoPath)) > 0 Then
        On Error Resume Next
        Set shp = sld.Shapes.AddPicture(logoPath, msoFalse, msoTrue, 36, 28, 140, 48)
        On Error GoTo ErrHandler
    End If

    ' Product title
    Set shp = sld.Shapes.AddTextbox(Orientation:=msoTextOrientationHorizontal, _
        Left:=leftMargin, Top:=slideH * 0.32, Width:=slideW - leftMargin * 2, Height:=90)
    With shp.TextFrame2
        .TextRange.Text = productName
        .TextRange.Font.Name = headingFontName
        .TextRange.Font.Size = 44
        .TextRange.Font.Bold = msoTrue
        .TextRange.Font.Fill.ForeColor.RGB = RGB(255, 255, 255)
        .VerticalAnchor = msoAnchorMiddle
    End With

    ' Tagline
    Set shp = sld.Shapes.AddTextbox(Orientation:=msoTextOrientationHorizontal, _
        Left:=leftMargin, Top:=slideH * 0.44, Width:=slideW - leftMargin * 2, Height:=60)
    With shp.TextFrame2
        .TextRange.Text = productTagline
        .TextRange.Font.Name = bodyFontName
        .TextRange.Font.Size = 20
        .TextRange.Font.Fill.ForeColor.RGB = RGB(235, 235, 235)
        .VerticalAnchor = msoAnchorTop
    End With

    ' Hero image (optional)
    If Len(Trim(heroImagePath)) > 0 Then
        On Error Resume Next
        Dim heroWidth As Single: heroWidth = slideW * 0.32
        Dim heroLeft As Single: heroLeft = slideW - heroWidth - 48
        Dim heroTop As Single: heroTop = slideH * 0.18
        Set shp = sld.Shapes.AddPicture(heroImagePath, msoFalse, msoTrue, heroLeft, heroTop, heroWidth, heroWidth * 0.6)
        On Error GoTo ErrHandler
    End If

    ' Subtle entrance animation for title
    Call AddFadeInAnimation(sld, 1) ' first shape is title

    ' Slide transition
    sld.SlideShowTransition.EntryEffect = ppEffectFade

    ' --- Introduction / Vision ---
    Set sld = pres.Slides.Add(pres.Slides.Count + 1, ppLayoutText)
    Call SimpleTwoColumn(sld, "Introduction & Vision", _
        "Brief overview of the product and the problem it solves. Use a hero visual, concept illustration, or data-driven background to set the tone.", _
        mockupImagePath, slideW, slideH, headingFontName, bodyFontName)
    sld.SlideShowTransition.AdvanceOnTime = msoTrue
    sld.SlideShowTransition.AdvanceTime = 0.5

    ' --- Key Features & Benefits: create N slides ---
    For i = 1 To numFeatureSlides
        Set sld = pres.Slides.Add(pres.Slides.Count + 1, ppLayoutBlank)
        Dim headerText As String: headerText = "Feature " & i
        Dim oneLiner As String: oneLiner = "One-line benefit for Feature " & i & ". Keep it concise and customer-focused."
        Call FeatureSlide(sld, headerText, oneLiner, mockupImagePath, coreColor2, leftMargin, slideW, slideH, headingFontName, bodyFontName)
        sld.SlideShowTransition.EntryEffect = ppEffectPush
    Next i

    ' --- Technical Specifications (table) ---
    Set sld = pres.Slides.Add(pres.Slides.Count + 1, ppLayoutBlank)
    Call TechnicalSpecsSlide(sld, "Technical Specifications", headingFontName, bodyFontName, neutralLight, neutralDark, slideW, slideH, leftMargin)
    sld.SlideShowTransition.EntryEffect = ppEffectFadeSmoothly

    ' --- Use Cases & Value Proposition ---
    Set sld = pres.Slides.Add(pres.Slides.Count + 1, ppLayoutText)
    Call UseCasesSlide(sld, "Use Cases & Value Proposition", _
        "Showcase real-world scenarios where the product creates value. Include quick mockups or short customer scenarios.", mockupImagePath, headingFontName, bodyFontName)

    ' --- Competitive Advantage (comparison) ---
    Set sld = pres.Slides.Add(pres.Slides.Count + 1, ppLayoutBlank)
    Call CompetitiveComparisonSlide(sld, "Competitive Advantage", headingFontName, bodyFontName, slideW, slideH, leftMargin)
    sld.SlideShowTransition.EntryEffect = ppEffectDissolve

    ' --- Call to Action ---
    Set sld = pres.Slides.Add(pres.Slides.Count + 1, ppLayoutBlank)
    Call CTASlide(sld, "Next Steps", "Request a Demo • Start Free Trial • Contact Sales", logoPath, coreColor3, headingFontName, bodyFontName, leftMargin, slideW, slideH)
    sld.SlideShowTransition.EntryEffect = ppEffectFade

    ' Final polish: set slide show settings (optional)
    pres.SlideShowSettings.ShowWithNarration = msoTrue
    pres.SlideShowSettings.ShowWithAnimation = msoTrue

    MsgBox "Presentation generated: " & pres.Name, vbInformation

    Exit Sub

ErrHandler:
    MsgBox "Error: " & Err.Number & " - " & Err.Description, vbCritical
End Sub

' ---------- Helper: Apply global colors and fonts ----------
Sub ApplyGlobalStyles(pres As Object, c1 As Long, c2 As Long, c3 As Long, nl As Long, nd As Long, hFont As String, bFont As String)
    Dim sldMaster As Object
    Set sldMaster = pres.SlideMaster
    On Error Resume Next
    
    ' Apply background color
    sldMaster.Background.Fill.ForeColor.RGB = nl
    
    ' Apply font to placeholders
    Dim shp As Object
    For Each shp In sldMaster.Shapes
        If shp.Type = msoPlaceholder Then
            On Error Resume Next
            shp.TextFrame2.TextRange.Font.Name = bFont
            shp.TextFrame2.TextRange.Font.Size = 18
            On Error GoTo 0
        End If
    Next shp
End Sub


' ---------- Helper: simple two-column slide with image on right ----------
Sub SimpleTwoColumn(sld As Slide, titleText As String, bodyText As String, imagePath As String, slideW As Single, slideH As Single, hFont As String, bFont As String)
    Dim leftColW As Single: leftColW = slideW * 0.55
    Dim rightColW As Single: rightColW = slideW - leftColW - 96
    Dim titleShp As Shape, bodyShp As Shape, imgShp As Shape

    Set titleShp = sld.Shapes.Title
    If titleShp Is Nothing Then
        Set titleShp = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, 48, 40, leftColW, 60)
    End If
    titleShp.TextFrame2.TextRange.Text = titleText
    titleShp.TextFrame2.TextRange.Font.Name = hFont
    titleShp.TextFrame2.TextRange.Font.Size = 32
    titleShp.TextFrame2.TextRange.Font.Bold = msoTrue

    Set bodyShp = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, 48, 110, leftColW, slideH - 160)
    bodyShp.TextFrame2.TextRange.Text = bodyText
    bodyShp.TextFrame2.TextRange.Font.Name = bFont
    bodyShp.TextFrame2.TextRange.Font.Size = 18
    bodyShp.TextFrame2.TextRange.ParagraphFormat.SpaceAfter = 8

    If Len(Trim(imagePath)) > 0 Then
        On Error Resume Next
        Set imgShp = sld.Shapes.AddPicture(imagePath, msoFalse, msoTrue, leftColW + 64, 80, rightColW, rightColW * 0.6)
        On Error GoTo 0
    End If

    ' Subtle animations
    Call AddFadeInAnimation(sld, 1) ' title
    Call AddFadeInAnimation(sld, 2) ' body
End Sub

' ---------- Helper: Feature slide layout ----------
Sub FeatureSlide(sld As Slide, header As String, oneLiner As String, imagePath As String, accentColor As Long, leftMargin As Single, slideW As Single, slideH As Single, hFont As String, bFont As String)
    Dim headerShp As Shape, textShp As Shape, img As Shape, icon As Shape
    Set headerShp = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, leftMargin, 48, slideW - leftMargin * 2, 50)
    With headerShp.TextFrame2
        .TextRange.Text = header
        .TextRange.Font.Name = hFont
        .TextRange.Font.Size = 28
        .TextRange.Font.Bold = msoTrue
        .TextRange.Font.Fill.ForeColor.RGB = accentColor
    End With

    Set textShp = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, leftMargin, 110, (slideW - leftMargin * 3) * 0.52, 120)
    With textShp.TextFrame2
        .TextRange.Text = oneLiner
        .TextRange.Font.Name = bFont
        .TextRange.Font.Size = 18
        .MarginLeft = 6
    End With

    ' small image/mockup to the right
    If Len(Trim(imagePath)) > 0 Then
        Dim imgLeft As Single: imgLeft = slideW * 0.6
        Dim imgTop As Single: imgTop = 90
        On Error Resume Next
        Set img = sld.Shapes.AddPicture(imagePath, msoFalse, msoTrue, imgLeft, imgTop, slideW * 0.32, slideH * 0.36)
        On Error GoTo 0
    End If

    ' Minimal icon accent (circle)
    Set icon = sld.Shapes.AddShape(msoShapeOval, leftMargin, 48, 36, 36)
    icon.Fill.ForeColor.RGB = accentColor
    icon.Line.Visible = msoFalse

    ' Animations
    Call AddFadeInAnimation(sld, headerShp.Id)
    Call AddFadeInAnimation(sld, textShp.Id)
    If Not img Is Nothing Then Call AddFadeInAnimation(sld, img.Id)
End Sub

' ---------- Helper: Technical Specs slide ----------
Sub TechnicalSpecsSlide(sld As Slide, titleText As String, hFont As String, bFont As String, bg As Long, fg As Long, slideW As Single, slideH As Single, leftMargin As Single)
    Dim titleShp As Shape, tbl As Shape
    Set titleShp = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, leftMargin, 36, slideW - leftMargin * 2, 48)
    titleShp.TextFrame2.TextRange.Text = titleText
    titleShp.TextFrame2.TextRange.Font.Name = hFont
    titleShp.TextFrame2.TextRange.Font.Size = 30
    titleShp.TextFrame2.TextRange.Font.Bold = msoTrue

    ' Create a specs table (columns: Spec, Details)
    Dim rows As Integer: rows = 6
    Dim cols As Integer: cols = 2
    Dim tblLeft As Single: tblLeft = leftMargin
    Dim tblTop As Single: tblTop = 120
    Dim tblWidth As Single: tblWidth = slideW - leftMargin * 2
    Dim tblHeight As Single: tblHeight = 240

    Set tbl = sld.Shapes.AddTable(rows, cols, tblLeft, tblTop, tblWidth, tblHeight)
    Dim r As Integer, c As Integer
    For r = 1 To rows
        tbl.Table.rows(r).Height = tblHeight / rows
        For c = 1 To cols
            With tbl.Table.Cell(r, c).Shape.TextFrame2.TextRange
                .Font.Name = bFont
                .Font.Size = IIf(c = 1, 14, 13)
                If c = 1 Then
                    .Text = Choose(r, "Platform", "Architecture", "API", "Data & Storage", "Security", "Performance")
                    .Font.Bold = msoTrue
                Else
                    .Text = Choose(r, _
                        "Windows / macOS / Linux / Cloud", _
                        "Microservices with event-driven bus", _
                        "REST + GraphQL, OAuth2", _
                        "Encrypted storage, S3-compatible", _
                        "SOC2-ready, role-based access", _
                        "99.9% SLA, autoscaling")
                End If
                .Font.Fill.ForeColor.RGB = fg
                tbl.Table.Cell(r, c).Shape.TextFrame2.MarginLeft = 6
                tbl.Table.Cell(r, c).Shape.TextFrame2.MarginRight = 6
            End With
        Next c
    Next r

    ' Optional: add a small architecture diagram placeholder (rectangle)
    Dim arch As Shape
    Set arch = sld.Shapes.AddShape(msoShapeFlowchartProcess, tblLeft + tblWidth + 12, tblTop, 160, 120)
    arch.TextFrame2.TextRange.Text = "Architecture Diagram"
    arch.TextFrame2.TextRange.Font.Name = bFont
    arch.Fill.ForeColor.RGB = RGB(245, 245, 245)
    arch.Line.ForeColor.RGB = fg
End Sub

' ---------- Helper: Use Cases slide ----------
Sub UseCasesSlide(sld As Slide, titleText As String, bodyText As String, imagePath As String, hFont As String, bFont As String)
    Dim titleShp As Shape, bodyShp As Shape, img As Shape
    Set titleShp = sld.Shapes.Title
    If titleShp Is Nothing Then
        Set titleShp = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, 48, 36, 720, 44)
    End If
    titleShp.TextFrame2.TextRange.Text = titleText
    titleShp.TextFrame2.TextRange.Font.Name = hFont
    titleShp.TextFrame2.TextRange.Font.Size = 28
    titleShp.TextFrame2.TextRange.Font.Bold = msoTrue

    Set bodyShp = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, 48, 100, 560, 240)
    bodyShp.TextFrame2.TextRange.Text = bodyText & vbNewLine & vbNewLine & _
        "• Use Case 1: Example customer scenario (pain -> solution -> outcome)." & vbNewLine & _
        "• Use Case 2: Quick mockup notes or short customer success snippet."
    bodyShp.TextFrame2.TextRange.Font.Name = bFont
    bodyShp.TextFrame2.TextRange.Font.Size = 16

    If Len(Trim(imagePath)) > 0 Then
        On Error Resume Next
        Set img = sld.Shapes.AddPicture(imagePath, msoFalse, msoTrue, 620, 100, 280, 180)
        On Error GoTo 0
    End If

    Call AddFadeInAnimation(sld, 1)
    Call AddFadeInAnimation(sld, 2)
End Sub

' ---------- Helper: Competitive comparison ----------
Sub CompetitiveComparisonSlide(sld As Slide, titleText As String, hFont As String, bFont As String, slideW As Single, slideH As Single, leftMargin As Single)
    Dim titleShp As Shape, tblShp As Shape
    Set titleShp = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, leftMargin, 28, slideW - leftMargin * 2, 40)
    titleShp.TextFrame2.TextRange.Text = titleText
    titleShp.TextFrame2.TextRange.Font.Name = hFont
    titleShp.TextFrame2.TextRange.Font.Size = 30
    titleShp.TextFrame2.TextRange.Font.Bold = msoTrue

    ' Create a small comparison table: Product X vs Competitor A vs Competitor B
    Dim rows As Integer: rows = 5
    Dim cols As Integer: cols = 3
    Dim tblLeft As Single: tblLeft = leftMargin
    Dim tblTop As Single: tblTop = 100
    Dim tblW As Single: tblW = slideW - leftMargin * 2
    Dim tblH As Single: tblH = 220

    Set tblShp = sld.Shapes.AddTable(rows + 1, cols + 1, tblLeft, tblTop, tblW, tblH)
    Dim r As Integer, c As Integer
    ' header row/col
    tblShp.Table.Cell(1, 1).Shape.TextFrame2.TextRange.Text = "Feature"
    tblShp.Table.Cell(1, 2).Shape.TextFrame2.TextRange.Text = "Product X"
    tblShp.Table.Cell(1, 3).Shape.TextFrame2.TextRange.Text = "Competitor A"
    tblShp.Table.Cell(1, 4).Shape.TextFrame2.TextRange.Text = "Competitor B"

    Dim feats(1 To 5) As String
    feats(1) = "Integration"
    feats(2) = "Security"
    feats(3) = "Scalability"
    feats(4) = "Analytics"
    feats(5) = "Price"

    For r = 1 To rows
        tblShp.Table.Cell(r + 1, 1).Shape.TextFrame2.TextRange.Text = feats(r)
        tblShp.Table.Cell(r + 1, 2).Shape.TextFrame2.TextRange.Text = "?"
        tblShp.Table.Cell(r + 1, 3).Shape.TextFrame2.TextRange.Text = IIf(r = 5, "Higher", "•")
        tblShp.Table.Cell(r + 1, 4).Shape.TextFrame2.TextRange.Text = IIf(r <= 3, "•", "—")
    Next r

    ' Small visual metaphor (stacked shapes)
    Dim s1 As Shape, s2 As Shape
    Set s1 = sld.Shapes.AddShape(msoShapeRoundedRectangle, tblLeft + tblW + 12, tblTop, 120, 80)
    s1.TextFrame2.TextRange.Text = "Why we win"
    s1.Fill.ForeColor.RGB = RGB(0, 150, 136)
    s1.Line.Visible = msoFalse

    Set s2 = sld.Shapes.AddShape(msoShapeOval, tblLeft + tblW + 12, tblTop + 92, 120, 40)
    s2.TextFrame2.TextRange.Text = "Differentiators"
    s2.Fill.ForeColor.RGB = RGB(255, 183, 77)
    s2.Line.Visible = msoFalse

    Call AddFadeInAnimation(sld, 1)
End Sub

' ---------- Helper: CTA slide ----------
Sub CTASlide(sld As Slide, headerText As String, ctaText As String, logoPath As String, accentColor As Long, hFont As String, bFont As String, leftMargin As Single, slideW As Single, slideH As Single)
    sld.FollowMasterBackground = msoFalse
    sld.Background.Fill.Solid
    sld.Background.Fill.ForeColor.RGB = RGB(248, 249, 250)

    Dim titleShp As Shape, ctaShp As Shape, logoShp As Shape
    Set titleShp = sld.Shapes.AddTextbox(msoTextOrientationHorizontal, leftMargin, 60, slideW - leftMargin * 2, 60)
    titleShp.TextFrame2.TextRange.Text = headerText
    titleShp.TextFrame2.TextRange.Font.Name = hFont
    titleShp.TextFrame2.TextRange.Font.Size = 36
    titleShp.TextFrame2.TextRange.Font.Bold = msoTrue

    Set ctaShp = sld.Shapes.AddShape(msoShapeRoundedRectangle, leftMargin, 150, 420, 72)
    ctaShp.TextFrame2.TextRange.Text = ctaText
    ctaShp.TextFrame2.TextRange.Font.Name = bFont
    ctaShp.TextFrame2.TextRange.Font.Size = 18
    ctaShp.Fill.ForeColor.RGB = accentColor
    ctaShp.TextFrame2.TextRange.Font.Fill.ForeColor.RGB = RGB(255, 255, 255)
    ctaShp.TextFrame2.VerticalAnchor = msoAnchorMiddle
    ctaShp.Line.Visible = msoFalse

    If Len(Trim(logoPath)) > 0 Then
        On Error Resume Next
        Set logoShp = sld.Shapes.AddPicture(logoPath, msoFalse, msoTrue, slideW - 180, slideH - 110, 140, 60)
        On Error GoTo 0
    End If

    Call AddFadeInAnimation(sld, titleShp.Id)
    Call AddFadeInAnimation(sld, ctaShp.Id)
End Sub

' ---------- Helper: Add fade-in animation for shape index or id ----------
Sub AddFadeInAnimation(sld As Slide, shapeIdentifier As Variant)
    On Error Resume Next
    Dim seq As Sequence
    Set seq = sld.TimeLine.MainSequence
    Dim shp As Shape
    If VarType(shapeIdentifier) = vbString Or VarType(shapeIdentifier) = vbInteger Or VarType(shapeIdentifier) = vbLong Then
        ' if numeric treat as shape id (attempt), otherwise treat as index
        On Error Resume Next
        Set shp = sld.Shapes(shapeIdentifier)
        If shp Is Nothing Then
            ' try by index number
            Set shp = sld.Shapes(shapeIdentifier)
        End If
    Else
        Set shp = sld.Shapes(1)
    End If
    If Not shp Is Nothing Then
        Dim eff As Effect
        Set eff = seq.AddEffect(Shape:=shp, effectId:=msoAnimEffectFade)
        eff.Timing.Duration = 0.6
        eff.Timing.TriggerType = msoAnimTriggerAfterPrevious
    End If
    On Error GoTo 0
End Sub



