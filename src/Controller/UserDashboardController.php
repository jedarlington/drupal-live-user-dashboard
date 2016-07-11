<?php

namespace Drupal\user_dashboard\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Controller routines for page example routes.
 */
class UserDashboardController extends ControllerBase {

  /**
   * Constructs a page with descriptive content.
   *
   * Our router maps this method to the path 'examples/user_dashboard'.
   */
  public function description() {
    // Make our links. First the simple page.
    $user_dashboard_simple_link = Link::createFromRoute($this->t('simple page'), 'user_dashboard_simple')->toString();
    // Now the arguments page.
    $arguments_url = Url::fromRoute('user_dashboard_arguments', array('first' => '23', 'second' => '56'));
    $user_dashboard_arguments_link = Link::fromTextAndUrl($this->t('arguments page'), $arguments_url)->toString();

    // Assemble the markup.
    $build = array(
      '#markup' => $this->t('<p>Welcome to the User Dashboard.</p><div id="userdashboard"></div>'),
      '#attached' => array(
        'library' => array('user_dashboard/userdashbaord-assets'),
      ),
    );

    return $build;
  }

  /**
   * Constructs a simple page.
   *
   * The router _controller callback, maps the path
   * 'examples/user_dashboard/simple' to this method.
   *
   * _controller callbacks return a renderable array for the content area of the
   * page. The theme system will later render and surround the content with the
   * appropriate blocks, navigation, and styling.
   */
  public function simple() {
    return array(
      '#markup' => '<p>' . $this->t('Simple page: The quick brown fox jumps over the lazy dog.') . '</p>',
    );
  }

  /**
   * A more complex _controller callback that takes arguments.
   *
   * This callback is mapped to the path
   * 'examples/user_dashboard/arguments/{first}/{second}'.
   *
   * The arguments in brackets are passed to this callback from the page URL.
   * The placeholder names "first" and "second" can have any value but should
   * match the callback method variable names; i.e. $first and $second.
   *
   * This function also demonstrates a more complex render array in the returned
   * values. Instead of rendering the HTML with theme('item_list'), content is
   * left un-rendered, and the theme function name is set using #theme. This
   * content will now be rendered as late as possible, giving more parts of the
   * system a chance to change it if necessary.
   *
   * Consult @link http://drupal.org/node/930760 Render Arrays documentation
   * @endlink for details.
   *
   * @param string $first
   *   A string to use, should be a number.
   * @param string $second
   *   Another string to use, should be a number.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException
   *   If the parameters are invalid.
   */
  public function arguments($first, $second) {
    // Make sure you don't trust the URL to be safe! Always check for exploits.
    if (!is_numeric($first) || !is_numeric($second)) {
      // We will just show a standard "access denied" page in this case.
      throw new AccessDeniedHttpException();
    }

    $list[] = $this->t("First number was @number.", array('@number' => $first));
    $list[] = $this->t("Second number was @number.", array('@number' => $second));
    $list[] = $this->t('The total was @number.', array('@number' => $first + $second));

    $render_array['user_dashboard_arguments'] = array(
      // The theme function to apply to the #items.
      '#theme' => 'item_list',
      // The list itself.
      '#items' => $list,
      '#title' => $this->t('Argument Information'),
    );
    return $render_array;
  }

}
