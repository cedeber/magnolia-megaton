package ch.openinteractive.main.filters;

import ch.openinteractive.main.StarterKit;
import info.magnolia.module.site.functions.SiteFunctions;
import info.magnolia.templating.functions.TemplatingFunctions;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.mockito.Mockito.when;

public class LanguageDetectionFilterTest {

    private SiteFunctions sitefn;
    private TemplatingFunctions cmsfn;
    private StarterKit mainModule;
    private LanguageDetectionFilter languageDetectionFilter;
    private HttpServletRequest request;
    private HttpServletResponse response;
    private FilterChain filterChain;

    @Before
    public void setup() {
        request = Mockito.mock(HttpServletRequest.class);
        when(request.getRequestURI()).thenReturn("");
    }

    @Test
    public void doFilter() {

    }
}
